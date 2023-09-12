import {expect, test} from 'vitest'
import {InstantWallet} from "./main.ts";


test('wipe', async () => {
	const wallet = new InstantWallet()
	const key = wallet.getPrivateKey()
	const mnemonic = wallet.getMnemonic()

	wallet.wipe()

	const wallet2 = new InstantWallet()
	const key2 = wallet2.getPrivateKey()
	const mnemonic2 = wallet2.getMnemonic()

	expect(key).not.toBe(key2)
	expect(mnemonic).not.toBe(mnemonic2)
})

test('wallet test', async () => {
	const wallet = new InstantWallet()
	const key = wallet.getPrivateKey()
	const mnemonic = wallet.getMnemonic()
	expect(key).not.toBe(null)
	expect(mnemonic).not.toBe(null)
	console.log(key)
	console.log(mnemonic)
})

test('localstorage test', () => {
	const wallet = new InstantWallet()
	const key = wallet.getPrivateKey()
	const mnemonic = wallet.getMnemonic()

	const wallet2 = new InstantWallet()
	const key2 = wallet2.getPrivateKey()
	const mnemonic2 = wallet2.getMnemonic()

	expect(key).toBe(key2)
	expect(mnemonic).toBe(mnemonic2)
})
