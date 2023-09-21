import {
    Blockfrost,
    Constr,
    Data,
    fromHex,
    Lucid,
    SpendingValidator,
    toHex,
    TxHash,
} from 'lucid-cardano';

async function lock(
    lucid: Lucid,
    lovelace: bigint,
    { into, owner }: { into: SpendingValidator; owner: string }
): Promise<TxHash> {
    const contractAddress = lucid.utils.validatorToAddress(into);
    console.log('Contract', contractAddress);

    const tx = await lucid
        .newTx()
        .payToContract(contractAddress, { inline: owner }, { lovelace })
        .complete();

    const signedTx = await tx.sign().complete();

    return signedTx.submit();
}

export { lock }