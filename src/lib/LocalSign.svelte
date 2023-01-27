<script lang="ts">
	import { ethers } from 'ethers';
	import { fly } from 'svelte/transition';

	export let web3Props: Web3Props;
	$: nonce = Math.floor(Math.random() * 1000000);
	$: signature = '';
	let valid: boolean | null = null;
	$: address = '';
	$: signed = false;
	let expectedAddr: string;
	const notYourAddr = '0x0000000000000000000000000000000000000000';
	async function sign() {
		nonce = Math.floor(Math.random() * 1000000);
		signature = await web3Props.signer.signMessage(`Signing one-time nonce: ${nonce}`);
		signed = true;
	}
	function verify() {
		address = ethers.utils.verifyMessage(`Signing one-time nonce: ${nonce}`, signature);
		valid = address === expectedAddr;
	}
	async function reset() {
		nonce = Math.floor(Math.random() * 1000000);
		signature = '';
		valid = null;
		address = '';
		web3Props.account = await web3Props.signer.getAddress();
		signed = false;
	}
</script>

<div class="grid place-content-center pt-11">
	{#if !signed}
		<div
			class="card  bg-base-100 shadow-xl max-w-xl"
			in:fly={{ duration: 200, x: 100 }}
			out:fly={{ duration: 100, x: -100 }}
		>
			<figure><img src="https://placeimg.com/400/225/arch" alt="Random" /></figure>
			<div class="card-body">
				<h2 class="card-title">Your Public Address:</h2>
				<p>{web3Props.account}</p>
				<h2 class="card-title">The Address I'm expecting:</h2>
				<p>{expectedAddr != 'Select Address' ? expectedAddr : ''}</p>
				<select class="select select-primary w-full max-w-xs" bind:value={expectedAddr}>
					<option disabled selected>Select Address</option>
					<option value={web3Props.account}>Your Address</option>
					<option value={notYourAddr}>Not Your Address</option>
				</select>

				<div class="card-actions justify-end">
					<button
						class="btn btn-primary"
						on:click={sign}
						disabled={expectedAddr === 'Select Address'}>Sign</button
					>
				</div>
			</div>
		</div>
	{/if}
	{#if signed}
		<div
			class="card bg-base-100 shadow-xl max-w-xl"
			in:fly={{ delay: 100, duration: 200, x: 100 }}
			out:fly={{ duration: 100, x: -100 }}
		>
			<figure><img src="https://placeimg.com/400/225/arch" alt="Random" /></figure>
			<div class="card-body">
				<p>
					Using the message and signature, I can derive the address that signed it. If it matches as
					expected you are good to go!
				</p>
				<h2 class="card-title">Message Signed:</h2>
				<p>Signing one-time nonce: {nonce}</p>
				<h2 class="card-title">Your Signature:</h2>
				<p class="break-words">{signature}</p>
				<h2 class="card-title">Expected Address:</h2>
				<p>{expectedAddr}</p>
				<h2 class="card-title">Derived Address:</h2>
				<p>{address ? address : 'Verify Signature 👇'}</p>
				<div class="card-actions">
					<div class="stat">
						{#if valid}
							<div class="stat-value text-primary">Valid Address</div>
						{:else if valid !== null}
							<div class="stat-value text-secondary">Invalid Address</div>
						{/if}

						<div class="stat-actions">
							<button class="btn btn-sm btn-success" on:click={verify}>Verify Signature</button>
						</div>
						<div class="stat-value text-primary">
							<button class="btn btn-primary" on:click={reset}>Start Over</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
