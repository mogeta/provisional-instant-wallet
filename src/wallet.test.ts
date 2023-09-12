import LocalWallet from "./wallet.ts";
import {expect, test} from 'vitest'
import {ethers, hexlify, toUtf8Bytes,} from "ethers";

const key = process.env.TEST_PRIVATE_KEY
const address = process.env.TEST_ADDRESS

test('same address', async () => {
	if (!key) {
		throw new Error("TEST_PRIVATE_KEY is not defined")
	}
	const wallet = new LocalWallet(key)
	expect(wallet.getAddress()).toBe(address);
})


test('personal_sign', async () => {
	if (!key) {
		throw new Error("TEST_PRIVATE_KEY is not defined")
	}
	const message = 'Hello, Ethereum!';
	const wallet = new LocalWallet(key)
	const messageHash = ethers.hashMessage(message);


	const data = ((typeof (message) === "string") ? toUtf8Bytes(message) : message);
	const address = await wallet.getAddress()

	const params = [hexlify(data), address.toLowerCase()];

	const signature = await wallet.request({method: "personal_sign", params: params})
	const recoveredAddress = ethers.recoverAddress(messageHash, signature);
	expect(recoveredAddress).toBe(wallet.getAddress());

})

test('baranceof', async () => {
	if (!key) {
		throw new Error("TEST_PRIVATE_KEY is not defined")
	}
	const erc20ABI = [{ "inputs": [{ "internalType": "address", "name": "_l2Bridge", "type": "address" }, { "internalType": "address", "name": "_l1Token", "type": "address" }, { "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_symbol", "type": "string" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "l1Token", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "l2Bridge", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "_interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }];
	const tokenAddress = "0x2b84062924acfe71625706d410BC1b8eBF4c909d";

	const wallet = new LocalWallet(key,"0x4ee5");
	const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, wallet.getProvider());

	async function getTokenBalance() {
		const balance = await tokenContract.balanceOf("0x2b84062924acfe71625706d410BC1b8eBF4c909d");
		console.log("Token Balance:", ethers.formatUnits(balance, 18));
	}

	await getTokenBalance();
})

test("provider", async () => {
	if (!key) {
		throw new Error("TEST_PRIVATE_KEY is not defined")
	}
	const wallet = new LocalWallet(key);

	const provider = new ethers.BrowserProvider(wallet)
	expect(provider).toBeDefined()
})

