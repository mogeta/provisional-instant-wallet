import {ethers, JsonRpcProvider, Wallet} from 'ethers';
import {EventEmitter} from 'eventemitter3';
import rpcUrls from "./rpcurls.ts";
import {createLocalStorage} from "localstorage-ponyfill";

class LocalWallet extends EventEmitter {
	localStorage: any;
	prefix = "itw:::";
	network_localstorage_key = `${this.prefix}_chainhex_key`;
	isMetaMask: boolean;
	isStatus?: boolean;
	host?: string;
	path?: string;
	private jsonRpcProvider: JsonRpcProvider
	public wallet: Wallet;
	private chainId: number | undefined;

	constructor(privateKey: string, chainHex="0x4a43") {
		super();
		this.localStorage = createLocalStorage();
		this.isMetaMask = false;
		this.isStatus = false;
		this.host = ""
		this.path = ""

		const networkHex = this.localStorage.getItem(this.network_localstorage_key)
		if (!networkHex) {
			this.jsonRpcProvider = new JsonRpcProvider(rpcUrls[chainHex]);
		}else {
			this.jsonRpcProvider = new JsonRpcProvider(rpcUrls[networkHex]);
		}
		this.wallet = new Wallet(privateKey, this.jsonRpcProvider);
		// this.wallet = Wallet.fromPhrase(phrase,this.jsonRpcProvider)

		this._initialize();
	}

	private async _initialize(): Promise<void> {
		const network = await this.jsonRpcProvider.getNetwork()
		this.chainId = Number(network.chainId);
	}

	public getAddress() {
		return this.wallet.address;
	}

	public getProvider() {
		return this.jsonRpcProvider;
	}

	public async request({method, params}: { method: string, params: any[] }): Promise<any> {
		switch (method) {
			case 'wallet_addEthereumChain':
				if (!params[0].rpcUrls) {
					throw new Error('No rpcUrls in params');
				}
				const rpcURL = params[0].rpcUrls[0];

				this.jsonRpcProvider = new JsonRpcProvider(rpcURL);
				const network = await this.jsonRpcProvider.getNetwork()
				this.chainId = Number(network.chainId);
				this.emitChainChanged();
				return;

			case 'wallet_switchEthereumChain':
				const id = rpcUrls[params[0].chainId.toLowerCase()];
				if(!id) {
					return
				}
				this.jsonRpcProvider = new JsonRpcProvider(id);
				const switchNetwork = await this.jsonRpcProvider.getNetwork()
				this.localStorage.setItem(this.network_localstorage_key,params[0].chainId.toLowerCase());
				this.chainId = Number(switchNetwork.chainId);
				this.emitChainChanged()
				return;
			// case 'eth_chainId':
			// 	return this.chainId;
			case 'eth_requestAccounts':
			case 'eth_accounts':
				return [this.wallet.address];
			case 'eth_sendTransaction':
				const txResponse = await this.wallet.sendTransaction(params[0]);
				return txResponse.hash;
			case 'personal_sign':
				return await this.wallet.signMessage(ethers.toBeArray(params[0]));
			case 'eth_call':
				return this.handleEthCall(params);
			default:
				const result = await this.jsonRpcProvider.send(method, params);
				return result;
		}
	}

	sendAsync?: (request: {
		method: string,
		params?: Array<any>
	}, callback: (error: any, response: any) => void) => void
	send?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void

	async handleEthCall(params: any) {
		// eth_callのパラメータを取得
		const transaction = params[0];
		const blockTag = params[1] || 'latest';

		console.log(transaction)
		// eth_callを実行
		const tx = {
			to: transaction.to,
			data: transaction.input ?? transaction.data ?? "",
			gasLimit: transaction.gas,
			gasPrice: transaction.gasPrice,
			value: transaction.value,
			nonce: transaction.nonce,
			chainId: transaction.chainId,
			blockTag: blockTag
		}
		console.log(tx)
		const result = await this.jsonRpcProvider.call(tx);
		// const result = await this.jsonRpcProvider.call(params);
		return result;
	}

	// EIP-1193のイベントをサポートするためのヘルパーメソッド
	public emitChainChanged(): void {
		this.emit('chainChanged', this.chainId);
		// this.emit('chainChanged', toBeHex(this.chainId));
	}

	public emitAccountsChanged(accounts: string[]): void {
		this.emit('accountsChanged', accounts);
	}

}

export default LocalWallet;