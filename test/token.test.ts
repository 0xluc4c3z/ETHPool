import { expect } from "chai";
import { ethers } from "hardhat";
import { ETHPool__factory } from "../typechain-types";

describe("ETHPool", function () {

  const ADMIN_ROLE = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
  const TEAM_ROLE = "0x5146a08baf902532d0ee2f909971144f12ca32651cd70cbee1117cddfb3b3b33";

  beforeEach(async function () {
    [this.deployer, this.alice, this.bob, this.member] = await ethers.getSigners();

    this.ethpool = await new ETHPool__factory(this.deployer).deploy();

    await this.ethpool.deployed();
  })

  describe("#init", function () {
    it('alice can deposit and withdraw your ether', async function () {
      
      await this.ethpool.connect(this.alice).deposit({ value: ethers.utils.parseEther("0.5") });
      expect(await this.ethpool.connect(this.alice).getPoolBalance()).to.be.eq(ethers.utils.parseEther("0.5"));

      await this.ethpool.connect(this.alice).withdrawExactETH(ethers.utils.parseEther("0.2"));
      expect(await this.ethpool.connect(this.alice).getUserBalance(this.alice.address)).to.be.eq(ethers.utils.parseEther("0.3"));

      await this.ethpool.connect(this.alice).withdrawAllETH();
      expect(await this.ethpool.connect(this.alice).getPoolBalance()).to.be.eq(0);
    })

    it('admin can deposit rewards for the users in the pool', async function () {

      await this.ethpool.connect(this.alice).deposit({ value: ethers.utils.parseEther("0.5") });

      await this.ethpool.connect(this.deployer).grantRole(TEAM_ROLE,this.bob.address);
      expect(await this.ethpool.hasRole(TEAM_ROLE, this.bob.address)).to.be.eq(true);

      expect(await this.ethpool.connect(this.bob).depositRewards({ value: ethers.utils.parseEther("0.5") }));
      //expect(await this.ethpool.connect(this.deployer).depositRewards({ value: ethers.utils.parseEther("1") })).to.be.reverted;

      expect(await this.ethpool.getRewardBalance()).to.be.eq(ethers.utils.parseEther("0.5"));
    });
  });

  describe("#flow important", async function () {
    it('', async function () {
      await this.ethpool.connect(this.deployer).grantRole(TEAM_ROLE,this.member.address);
      expect(await this.ethpool.hasRole(TEAM_ROLE, this.member.address)).to.be.eq(true);

      await this.ethpool.connect(this.alice).deposit({ value: ethers.utils.parseEther("0.01") });
      await this.ethpool.connect(this.bob).deposit({ value: ethers.utils.parseEther("0.03") });
      expect(await this.ethpool.getPoolBalance()).to.be.eq(ethers.utils.parseEther("0.04"));
      
      await this.ethpool.connect(this.member).depositRewards({ value: ethers.utils.parseEther("0.02") });
      await this.ethpool.connect(this.alice).claimRewards();
      await this.ethpool.connect(this.bob).claimRewards();
      expect(await this.ethpool.getUserBalance(this.alice.address)).to.be.eq(ethers.utils.parseEther("0.015"));
      expect(await this.ethpool.getUserBalance(this.bob.address)).to.be.eq(ethers.utils.parseEther("0.045"));
    });
  });
});
