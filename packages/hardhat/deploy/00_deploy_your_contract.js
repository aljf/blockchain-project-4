// deploy/00_deploy_your_contract.js

//const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const members = ["0x086f3ECB5a0858c5e4F64DD03b340E8866E94bC0"]  // add your localhost contract address here
  PowDAO = await deploy("PowDAO", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [ members ],
    log: true,
  });

  const FacetCutAction = {
    Add: 0,
    Replace: 1,
    Remove: 2
  }

  function getSelectors(contract) {
    const selectors = contract.reduce((acc, val) => {
      console.log(val.signature)
      console.log(acc)
      if (val.type === 'function') {
        acc.push(val.signature)
        return acc
      } else {
        return acc
      }
    }, [])
    return selectors
  }

  const PowDAOFacet = await deploy("PowDAOFacet", {
    from: deployer,
    args: [ members ],
    log: true,
  }) 
  const diamondCutFacet = await deploy("DiamondCutFacet", {
    from: deployer,
    log: true,
  }) 

 // initial version of the defi and diamond cut facet after deploying the initial version of these contracts feel free to comment line 37 - 40 and line 34 and make changes to the defi facet contract and deploy alone and upgrade the diamond through ui
 // diamonf cut params include facet address, action and function signatures
  const diamondCutParams = [
    [diamondCutFacet.address, FacetCutAction.Add, [ '0x1f931c1c' ]],
    [PowDAOFacet.address, FacetCutAction.Add, ['0xc127c247', '0x29cb924d', '0x044a0ca8', '0x8006745b', 
    '0xb2643aab', '0x797daf70', '0x9425a476', '0xef23f87a', '0x08ae4b0c', '0x0b7e9c44', '0xb470aade', 
    '0xe63bc62d', '0xda35c664', '0x3b214a74', '0x013cf08b', '0x230aac55', '0x99653fbe', '0x7d5b6c72', 
    '0x635e99aa', '0x3a98ef39', '0x8340bbce']]
  ]
  // eslint-disable-next-line no-unused-vars
  const deployedDiamond = await deploy("Diamond", {
    from: deployer,
    args: [diamondCutParams],
    log: true,
    })

  
  await deploy("AddingFacet", {
    from: deployer,
    log: true,
  });
  
  // const PowDAOFacetContract = await ethers.getContract("PowDAOFacet", deployer);
  // PowDAOFacetContract.transferOwnership("0xF52a71ecc3CD6EB619c21759EB78568f09570E18");

  // const diamondCutFacetContract = await ethers.getContract("diamondCutFacet", deployer);
  // diamondCutFacetContract.transferOwnership("0xF52a71ecc3CD6EB619c21759EB78568f09570E18");

  // const diamondContract = await ethers.getContract("Diamond", deployer);
  // diamondContract.transferOwnership("0xF52a71ecc3CD6EB619c21759EB78568f09570E18");

  // const AddingFacetContract = await ethers.getContract("AddingFacet", deployer);
  // AddingFacetContract.transferOwnership("0xF52a71ecc3CD6EB619c21759EB78568f09570E18");

  /*
    // Getting a previously deployed contract
    const YourContract = await ethers.getContract("YourContract", deployer);
    await YourContract.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = ["YourContract"];
