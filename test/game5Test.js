const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    // Hardhat provides a list of signers
    const signers = await ethers.getSigners();

    // Find a signer whose address is less than the threshold
    let winnerSigner;
    const threshold = ethers.BigNumber.from(
      "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf"
    );
    for (let signer of signers) {
      const address = await signer.getAddress();
      if (ethers.BigNumber.from(address).lt(threshold)) {
        winnerSigner = signer;
        break;
      }
    }

    return { game, winnerSigner };
  }

  it("should be a winner", async function () {
    const { game, winnerSigner } = await loadFixture(
      deployContractAndSetVariables
    );

    // Ensure we found a valid signer
    assert.isDefined(winnerSigner, "No valid signer found");

    // Call the win function with the winner signer
    await game.connect(winnerSigner).win();

    // Check if the game is won
    const isGameWon = await game.isWon();

    // Assertion
    assert.isTrue(isGameWon, "You did not win the game");
  });
});
