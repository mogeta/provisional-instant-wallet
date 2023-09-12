import { Wallet} from "ethers";
import {createLocalStorage} from "localstorage-ponyfill";
import LocalWallet from "./wallet.ts";

export class InstantWallet {
	localStorage: any;
	prefix = "itw:::";
	private_key = `${this.prefix}_private_key`;
	mnemonic_key = `${this.prefix}_mnemonic_key`;

	wallet: LocalWallet;

	constructor(chainHex="0x4a43") {
		this.localStorage = createLocalStorage();

		const key = this.localStorage.getItem(this.private_key)
		if (!key) {
			this.createKey();
		}

		this.wallet = new LocalWallet(this.getPrivateKey(),chainHex);

	}

	createKey() {
		const w = Wallet.createRandom();
		this.localStorage.setItem(this.mnemonic_key,w.mnemonic?.phrase);
		this.localStorage.setItem(this.private_key,w.privateKey);
	}

	getPrivateKey() {
		return this.localStorage.getItem(this.private_key);
	}

	getMnemonic() {
		return this.localStorage.getItem(this.mnemonic_key);
	}
	getProvider(){
		return this.wallet.getProvider()
	}

	getEIP1193Provider(){
		return this.wallet;
	}

	wipe(){
		this.localStorage.removeItem(this.private_key);
		this.localStorage.removeItem(this.mnemonic_key);
	}
}
