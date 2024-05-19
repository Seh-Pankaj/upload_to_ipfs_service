const pinataSdk = require("@pinata/sdk");
const mintNft = require("./mintNft");

const uploadToIpfs = async (req, res) => {
  try {
    const metadata = req.body.metadata;
    const propertyPrice = req.body.priceInEth;
    const ownerAddress = req.body.ownerAddress;
    const ipfsHashResponse = await pinMetadataToIpfs(metadata);
    const ipfsUri = `https://gateway.pinata.cloud/ipfs/${ipfsHashResponse}`;
    await mintNft(ownerAddress, propertyPrice, ipfsUri);

    // ipfs uri

    res.status(201).send(ipfsUri);
  } catch (e) {
    res.status(418).json("Upload to IPFS failed");
  }
};

const pinMetadataToIpfs = async (_metadata) => {
  const pinataApi = process.env.PINATA_API;
  const pinataSecret = process.env.PINATA_SECRET;
  try {
    const pinata = new pinataSdk(pinataApi, pinataSecret);
    const ipfsHashResponse = await pinata.pinJSONToIPFS(_metadata);
    return ipfsHashResponse.IpfsHash;
  } catch (e) {
    throw new Error("Pinning to IPFS Failed");
  }
};

module.exports = uploadToIpfs;
