import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Char "mo:core/Char";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Int;
    category : Category;
    weightOptions : [WeightOption];
    imageUrl : Text;
    inStock : Bool;
  };

  type WeightOption = {
    weight : Nat; // in grams
    price : Int;
  };

  type CartItem = {
    productId : Nat;
    weight : Nat; // in grams
    quantity : Nat;
  };

  type WishlistItem = {
    productId : Nat;
    weight : Nat;
  };

  type Category = {
    #nuts;
    #dryFruits;
    #seeds;
  };

  type Review = {
    author : Text;
    authorEmail : Text;
    content : Text;
    rating : Int; // 1 to 5
    productId : Nat;
  };

  type CustomerInfo = {
    name : Text;
    address : Text;
    zipCode : Int;
    city : Text;
    phoneNumber : Text;
    email : Text;
  };

  type Order = {
    orderId : Nat;
    customerInfo : CustomerInfo;
    cartItems : [CartItem];
    totalAmount : Int;
    paymentMethod : { #cashOnDelivery };
    status : { #pending };
  };

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let wishlists = Map.empty<Principal, List.List<WishlistItem>>();
  let reviews = Map.empty<Nat, Review>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 1;
  var nextReviewId = 1;
  var nextOrderId = 1;

  module Product {
    public func compareByName(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  public shared ({ caller }) func addToCart(productId : Nat, weight : Nat, quantity : Nat) : async () {
    if (quantity == 0) { Runtime.trap("Quantity must be greater than 0") };

    let newItem : CartItem = {
      productId;
      weight;
      quantity;
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let cartItemsArray = existingCart.toArray();
    let cartItems = List.fromArray<CartItem>(cartItemsArray);

    let updatedCartItems = cartItems.map<CartItem, CartItem>(
      func(item) {
        if (
          item.productId == productId and
          item.weight == weight
        ) {
          { item with quantity = item.quantity + quantity };
        } else { item };
      }
    );

    carts.add(caller, updatedCartItems);
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.add(caller, List.empty<CartItem>());
  };

  public shared ({ caller }) func addToWishlist(productId : Nat, weight : Nat) : async () {
    let newWishlistItem : WishlistItem = {
      productId;
      weight;
    };

    let existingWishlist = switch (wishlists.get(caller)) {
      case (null) { List.empty<WishlistItem>() };
      case (?wishlist) { wishlist };
    };

    existingWishlist.add(newWishlistItem);
    wishlists.add(caller, existingWishlist);
  };

  public query ({ caller }) func getWishlist() : async [WishlistItem] {
    switch (wishlists.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat, weight : Nat) : async () {
    let existingWishlist = switch (wishlists.get(caller)) {
      case (null) { Runtime.trap("No wishlist found") };
      case (?wishlist) { wishlist };
    };

    let filteredWishlist = existingWishlist.filter(
      func(item) { item.productId != productId or item.weight != weight }
    );

    wishlists.add(caller, filteredWishlist);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByName);
  };

  public query ({ caller }) func filterProductsByCategory(category : Category) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == category }
    );
    filtered.sort(Product.compareByName);
  };

  public query ({ caller }) func filterProductsByPriceRange(minPrice : Int, maxPrice : Int) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.price >= minPrice and product.price <= maxPrice
      }
    );
    filtered.sort(Product.compareByName);
  };

  public query ({ caller }) func filterProductsByWeight(weight : Nat) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(product) {
        product.weightOptions.find(
          func(option) { option.weight == weight }
        ) != null;
      }
    );
    filtered.sort(Product.compareByName);
  };

  public query ({ caller }) func getProductDetails(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func searchProducts(searchText : Text) : async [Product] {
    let lowerSearchText = searchText.map(toLower);
    let filtered = products.values().toArray().filter(
      func(product) {
        let lowerProductName = product.name.map(toLower);
        lowerProductName.contains(#text lowerSearchText);
      }
    );
    filtered.sort(Product.compareByName);
  };

  func toLower(c : Char) : Char {
    let natVal = c.toNat32();
    if (natVal >= 65 and natVal <= 90) {
      Char.fromNat32(natVal + 32);
    } else {
      c;
    };
  };

  public query ({ caller }) func getCategories() : async [Category] {
    [#nuts, #dryFruits, #seeds];
  };

  public query ({ caller }) func getReviews(productId : Nat) : async [Review] {
    let productReviews = reviews.values().toArray().filter(
      func(review) { review.productId == productId }
    );
    productReviews;
  };

  public query ({ caller }) func getOverallReviews() : async [Review] {
    let overallReviews = reviews.values().toArray().filter(
      func(review) { review.productId == 0 }
    );
    overallReviews;
  };
};
