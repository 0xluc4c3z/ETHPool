import { expect } from "chai";
import { ethers } from "hardhat";
import { ETHPool__factory } from "../typechain-types";

describe("Token", function () {
  
  beforeEach(async function(){
    [this.deployer, this.alice, this.bob] = await ethers.getSigners();

    this.ETHPool = await new ETHPool__factory(this.deployer).deploy();

    this.ETHPool = await ethers.getContractFactory("ETHPool");

    this.ethpool = await this.ETHPool.deploy();

    await this.ethpool.deployed();
  }
  
  describe("init", function () {

    it("anda", async function () {
      expect(await this.ethpool.connect(this.deployer).getPoolBalance()).to.be.eq(0);
    })
  })
});
