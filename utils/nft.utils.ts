import { fetchCandyMachine, mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { findAssociatedTokenPda, setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import {
  transactionBuilder,
  generateSigner,
  publicKey,
  percentAmount,
} from '@metaplex-foundation/umi';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import {
  createProgrammableNft,
  fetchDigitalAsset,
  findMetadataPda,
  findTokenRecordPda,
  safeFetchAllMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { PinataSDK } from 'pinata-web3';
import { v7 as uuid } from 'uuid';
import { mplCore } from '@metaplex-foundation/mpl-core';
import {
  createInitializeMintInstruction,
  createInitializeNonTransferableMintInstruction,
  ExtensionType,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import _ from 'lodash';

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

const CANDY_MACHINE_ADDRESS = import.meta.env.VITE_CANDY_MACHINE_ADDRESS;

const nfts: { [key: string]: { metadata: string; image: string; animationUrl: string } } = {
  connect_X_and_wallet: {
    metadata: '/nfts/quests/assets/1.json',
    image: '/nfts/quests/assets/nft.png',
    animationUrl: '/nfts/quests/assets/NFT.mp4',
  },
};

export const claimNFTReward = async (wallet: WalletContextState, achievementTag: string) => {
  if (!wallet.publicKey) {
    throw new Error('Wallet is not connected to mint the NFT');
  }

  const umi = createUmi(import.meta.env.VITE_SOLANA_RPC_PROVIDER_URL)
    .use(walletAdapterIdentity(wallet))
    .use(mplCore())
    .use(mplCandyMachine());

  const candyMachine = await fetchCandyMachine(umi, publicKey(CANDY_MACHINE_ADDRESS));
  const collectionNft = await fetchDigitalAsset(umi, candyMachine.collectionMint);

  const imageResponse = await fetch(`${window.location.origin}${nfts[achievementTag].image}`);
  const bytes = new Uint8Array(await imageResponse.arrayBuffer());
  const imageFile = new File(
    [bytes],
    `${achievementTag}.${nfts[achievementTag].image.split('.').pop()}`,
  );

  const imageUpload = await pinata.upload.file(imageFile);
  const imageUri = `https://${imageUpload.IpfsHash}.ipfs.dweb.link/`;

  const videoResponse = await fetch(
    `${window.location.origin}${nfts[achievementTag].animationUrl}`,
  );
  const videoBytes = new Uint8Array(await videoResponse.arrayBuffer());
  const videoFile = new File(
    [videoBytes],
    `${achievementTag}.${nfts[achievementTag].animationUrl.split('.').pop()}`,
  );

  const videoUpload = await pinata.upload.file(videoFile);
  const videoUri = `https://${videoUpload.IpfsHash}.ipfs.dweb.link/`;

  const metadataResponse = await fetch(`${window.location.origin}${nfts[achievementTag].metadata}`);
  const metadata = await metadataResponse.json();

  const metadataUpload = await pinata.upload.json(
    {
      ...metadata,
      update_authority: wallet.publicKey,
      image: imageUri,
      animation_url: videoUri,
      collection: {
        key: collectionNft.mint.publicKey,
      },
      attributes: [
        ...metadata.attributes,
        { trait_type: 'Unique identifier', value: uuid() },
        { trait_type: 'Date and time', value: new Date().toISOString().slice(0, 19) },
      ],
      properties: {
        creators: [{ address: wallet.publicKey, share: 100 }],
      },
    },
    { metadata: { name: `${achievementTag}.json` } },
  );
  const metadataUri = `https://${metadataUpload.IpfsHash}.ipfs.dweb.link/`;

  const nftMint = generateSigner(umi);

  const token = findAssociatedTokenPda(umi, {
    mint: nftMint.publicKey,
    owner: umi.identity.publicKey,
    tokenProgramId: publicKey(TOKEN_2022_PROGRAM_ID),
  });

  const tokenRecord = findTokenRecordPda(umi, {
    mint: nftMint.publicKey,
    token: token[0],
  });

  const extensions = [ExtensionType.NonTransferable];
  const mintLength = getMintLen(extensions);

  const mintLamports = await umi.rpc.getRent(mintLength);

  const createNftMintAccountInstruction = SystemProgram.createAccount({
    fromPubkey: new PublicKey(umi.identity.publicKey),
    newAccountPubkey: new PublicKey(nftMint.publicKey),
    space: mintLength,
    lamports: Number(mintLamports.basisPoints),
    programId: TOKEN_2022_PROGRAM_ID,
  });

  // Attach the non-transferable extension
  const initializeNonTranferableMintInstruction = createInitializeNonTransferableMintInstruction(
    new PublicKey(nftMint.publicKey),
    TOKEN_2022_PROGRAM_ID,
  );

  // Initialize the mint account
  const initializeMintInstruction = createInitializeMintInstruction(
    new PublicKey(nftMint.publicKey),
    0,
    new PublicKey(umi.identity.publicKey),
    new PublicKey(umi.identity.publicKey),
    TOKEN_2022_PROGRAM_ID,
  );

  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add({
      signers: [nftMint],
      instruction: {
        ...createNftMintAccountInstruction,
        keys: createNftMintAccountInstruction.keys.map(key => ({
          ...key,
          pubkey: publicKey(key.pubkey),
        })),
        programId: publicKey(createNftMintAccountInstruction.programId),
      },
      bytesCreatedOnChain: createNftMintAccountInstruction.data.buffer.byteLength,
    })
    .add({
      signers: [nftMint],
      instruction: {
        ...initializeNonTranferableMintInstruction,
        keys: initializeNonTranferableMintInstruction.keys.map(key => ({
          ...key,
          pubkey: publicKey(key.pubkey),
        })),
        programId: publicKey(initializeNonTranferableMintInstruction.programId),
      },
      bytesCreatedOnChain: initializeNonTranferableMintInstruction.data.buffer.byteLength,
    })
    .add({
      signers: [nftMint],
      instruction: {
        ...initializeMintInstruction,
        keys: initializeMintInstruction.keys.map(key => ({
          ...key,
          pubkey: publicKey(key.pubkey),
        })),
        programId: publicKey(initializeMintInstruction.programId),
      },
      bytesCreatedOnChain: initializeMintInstruction.data.buffer.byteLength,
    })
    .add(
      createProgrammableNft(umi, {
        ...metadata,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadataUri,
        collection: {
          key: collectionNft.mint.publicKey,
          verified: false,
        },
        authority: umi.identity,
        splTokenProgram: publicKey(TOKEN_2022_PROGRAM_ID),
        sellerFeeBasisPoints: percentAmount(0),
        updateAuthority: umi.identity,
        token,
        tokenRecord: tokenRecord,
        tokenOwner: umi.identity.publicKey,
        mint: nftMint,
      }),
    )
    .sendAndConfirm(umi);
};

export const checkIfNFTRewardWasClaimed = async (
  wallet: WalletContextState,
  achievementTag: string,
) => {
  if (!wallet.publicKey) {
    throw new Error('Wallet is not connected to check the NFT is minted');
  }

  const umi = createUmi(import.meta.env.VITE_SOLANA_RPC_PROVIDER_URL)
    .use(walletAdapterIdentity(wallet))
    .use(mplCore())
    .use(mplCandyMachine());

  const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_PROVIDER_URL);

  const allNFTs = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
    programId: TOKEN_2022_PROGRAM_ID,
  });

  const accounts = allNFTs.value
    .map(account => account.account.data.parsed.info)
    .filter(info => Number(info.tokenAmount.amount) > 0)
    .map(info => ({ mint: info.mint }));

  const metadataInfos = await safeFetchAllMetadata(
    umi,
    accounts.map(account => findMetadataPda(umi, { mint: publicKey(account.mint) })),
  );

  const metadataDetailedInfos = await Promise.all(
    metadataInfos.map(metadataInfo => fetch(metadataInfo.uri).then(response => response.json())),
  );

  return metadataDetailedInfos?.some(info =>
    info?.attributes?.some(
      (attribute: any) => attribute?.trait_type === 'Tag' && attribute?.value === achievementTag,
    ),
  );
};
