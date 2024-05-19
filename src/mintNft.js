const { ethers } = require("ethers");
const contractMetaData = require("../abi.json");

const mintNft = async (ownerAddress, propertyPrice, ipfsUrl) => {
  const alchemyApiKey = process.env.ALCHEMY_API;
  const priceInEth = ethers.parseEther(propertyPrice);

  const abi = contractMetaData.abi;
  const bytecode = contractMetaData.bytecode;
  let provider, wallet, privateKey;

  const networkName = "hardhat";

  if (networkName == "hardhat") {
    const hardhatURL = "http://127.0.0.1:8545/";
    try {
      privateKey = process.env.HARDHAT_PRIVATE_KEY;
      provider = new ethers.JsonRpcProvider(hardhatURL);
      wallet = new ethers.Wallet(privateKey, provider);
      console.log("Provider and wallet succesfully created in hardhat...");
    } catch (e) {
      console.log("Error in assigning provider and wallet", e);
    }
  } else if (networkName == "sepolia") {
    try {
      privateKey = process.env.SEPOLIA_PRIVATE_KEY;
      provider = new ethers.AlchemyProvider("sepolia", alchemyApiKey);
      wallet = new ethers.Wallet(privateKey, provider);
      console.log("Provider and wallet succesfully created in sepolia...");
    } catch (e) {
      console.log("Error in assigning provider and wallet", e);
    }
  } else {
    console.log("Unsupported Chain!");
  }

  try {
    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contractInstance = await contractFactory.deploy();

    console.log(
      "Decentralized Estate Contract Instance deployed at ",
      contractInstance.target
    );

    const tokenId = await contractInstance.getTokenId();

    const mintTxn = await contractInstance.listItem(
      ownerAddress,
      priceInEth,
      ipfsUrl
    );
    await mintTxn.wait(1);

    const tokenURI = await contractInstance.getTokenUri(tokenId);

    console.log("NFT minted Successfully with token Id : ", tokenId);
    console.log("Token URI : ", tokenURI);
  } catch (error) {
    console.log(error);
  }
};

module.exports = mintNft;
