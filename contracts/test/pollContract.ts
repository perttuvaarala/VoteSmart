
import { ethers } from "hardhat";
import { expect } from "chai";
import { PollContract } from "../typechain-types";

describe("PollContract", () => {
  let contract: PollContract;
  let owner: any, user1: any, user2: any;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    const PollFactory = await ethers.getContractFactory("PollContract");
    contract = await PollFactory.deploy();
    await contract.waitForDeployment();
  });

  it("should create poll with correct options", async () => {
    const options = ["Option A", "Option B", "Option C"];
    const duration = 3600;

    await contract.createPoll("Poll 1", duration, options);
    const pollId = await contract.getLatestPollId();
    const [name, endTime, isActive, storedOptions] = await contract.getPoll(pollId);

    expect(name).to.equal("Poll 1");
    expect(isActive).to.be.true;
    expect(storedOptions.length).to.equal(3);
    expect(storedOptions[0].name).to.equal("Option A");
  });

  it("should allow user to vote and increment vote count", async () => {
    const options = ["Yes", "No"];
    await contract.createPoll("Vote Poll", 300, options);
    const pollId = await contract.getLatestPollId();

    await contract.connect(user1).vote(pollId, 0);
    const [, , , storedOptions] = await contract.getPoll(pollId);
    expect(storedOptions[0].voteCount).to.equal(1);
  });

  it("should prevent double voting", async () => {
    const options = ["Option A", "Option B"];
    await contract.createPoll("No Double Voting", 300, options);
    const pollId = await contract.getLatestPollId();

    await contract.connect(user1).vote(pollId, 1);
    await expect(
      contract.connect(user1).vote(pollId, 0)
    ).to.be.revertedWith("You have already voted");
  });

  it("should prevent voting after poll ends", async () => {
    const options = ["Expired"];
    await contract.createPoll("Ends Quickly", 1, options);
    const pollId = await contract.getLatestPollId();

    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine");

    await expect(
      contract.connect(user1).vote(pollId, 0)
    ).to.be.revertedWith("Poll has ended");
  });

  it("should revert when voting with invalid poll ID", async function () {
  await expect(contract.vote(999, 0)).to.be.revertedWith("Invalid poll ID");
});

it("should revert when voting with invalid option ID", async function () {
  await contract.createPoll("Test", 60 * 60, ["Yes", "No"]);
  await expect(contract.vote(1, 99)).to.be.revertedWith("Invalid option ID");
});

});
