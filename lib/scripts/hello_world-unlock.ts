import {
    Blockfrost,
    Constr,
    Data,
    fromHex,
    Lucid,
    OutRef,
    Redeemer,
    SpendingValidator,
    toHex,
    TxHash,
    fromText,
} from 'lucid-cardano';
import * as cbor from 'cbor-x';
import * as fs from 'fs';

const main = async () => {
    const lucid = await Lucid.new(
        new Blockfrost(
            'https://cardano-preprod.blockfrost.io/api/v0',
            'preprodRQKWDs3oPLkiK9rMe1SmtM8PMHZhruzR'
        ),
        'Preprod'
    );

    lucid.selectWalletFromPrivateKey(
        fs.readFileSync('./key.sk').toString('utf-8')
    );
    const validator = await readValidator();

    const utxo: OutRef = {
        txHash: 'ba25c74868b9bdfd6607b4c6559b93be6ea180ae0bb45f7fd76722b48f817709',
        outputIndex: 0,
    };

    const redeemer = Data.to(new Constr(0, [fromText('Hello, World!')]));

    try {
        const unlockTxHash = await unlock(lucid, utxo, {
            from: validator,
            using: redeemer,
        });

        await lucid.awaitTx(unlockTxHash);
        console.log(`1 tADA unlocked from the contract
          Tx ID:    ${unlockTxHash}
          Redeemer: ${redeemer}
      `);
    } catch (e) {
        console.log(e);
    }

    // --- Supporting functions
};
async function unlock(
    lucid: Lucid,
    ref: OutRef,
    { from, using }: { from: SpendingValidator; using: Redeemer }
): Promise<TxHash> {
    const [utxo] = await lucid.utxosByOutRef([ref]);

    const tx = await lucid
        .newTx()
        .collectFrom([utxo], using)
        .addSigner(await lucid.wallet.address())
        .attachSpendingValidator(from)
        .complete();

    const signedTx = await tx.sign().complete();

    return signedTx.submit();
}

async function readValidator(): Promise<SpendingValidator> {
    const validator = JSON.parse(fs.readFileSync('plutus.json', 'utf-8'))
        .validators[0];

    return {
        type: 'PlutusV2',
        script: toHex(cbor.encode(fromHex(validator.compiledCode))),
    };
}


