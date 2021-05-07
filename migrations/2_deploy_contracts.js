const AuctionHouse = artifacts.require("AuctionHouse");
const Auction = artifacts.require("Auction");
module.exports = function(deployer) {
  deployer.deploy(AuctionHouse);
  deployer.deploy(Auction);
};
