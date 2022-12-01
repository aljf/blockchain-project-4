# 🏛️ Simple DAO with Diamond Contract

Team Members:
George Thomas
Robert Linhart
Arman Hasanzade
Colton Gross

Test Contract Addresses:
"PowDAOFacet" at 0x52F203D8c8b713EbC2709bED991F4026BF41ad29
"DiamondCutFacet" at 0x1970e4A1ACfA9367FD1E45b054ab9B2C04334a2c
"Diamond" at 0x9094abAAaE718090013fb183F4e919D3E51A5cb8
"AddingFacet" at 0xa3B69c7c217fA43b9B7F98d5CB5f5f39E8DD07B3

PowDAO transcations can be viewed here: https://sepolia.otterscan.io/address/0x52F203D8c8b713EbC2709bED991F4026BF41ad29

```bash
git clone <http url>

cd path/to/blockchain-project-4

git checkout blockchain-project-4
```

> install and start your 👷‍ Hardhat chain:

```bash
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
yarn deploy
```

🔏 Edit your smart contract `PowDAO.sol` in `packages/hardhat/contracts` and the new facets are in `packages/hardhat/contracts/facets`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

