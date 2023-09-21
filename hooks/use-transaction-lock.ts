import main from "lib/scripts/generate-credentials";
import { lock } from "lib/scripts/hello_world-lock";
import { Constr, Data, Lucid, SpendingValidator, fromHex, toHex } from "lucid-cardano";
import { useCallback, useEffect, useState } from "react";
import plutus from 'lib/scripts/plutus.json'
import * as cbor from 'cbor-x';

const useTransactionLockSender = (lucid?: Lucid) => {
  const [successMessage, setSuccessMessage] = useState<string>();
  const [error, setError] = useState<Error | undefined>();
  const [lovelace, setLovelace] = useState(0);
  const [toAccount, setToAccount] = useState("");
  const [owner, setOwner] = useState<string>("");

  useEffect(() => {
    if (!successMessage) return;

    const timeout = setTimeout(() => setSuccessMessage(undefined), 5000);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  const sendTransactionLock = useCallback(async () => {
    if (!lucid || !toAccount || !lovelace) return;

    // const privateKey = lucid.utils.generatePrivateKey();

    try {
      const publicKeyHash = lucid.utils.getAddressDetails(
        await lucid.wallet.address()
      ).paymentCredential!.hash;
      // const validator = await readValidator();
      const validator = plutus.validators[0];
      const into = {
        type: 'PlutusV2',
        script: toHex(cbor.encode(fromHex(validator.compiledCode))),
    }
      const datum = Data.to(new Constr(0, [publicKeyHash]));
      const txHash = await lock(lucid, BigInt(lovelace), {
        into: into as any,
        owner: datum,
      });
      console.log(`1 tADA locked into the contract at:
        Tx ID: ${txHash}
        Datum: ${datum}
    `);
    } catch (e) {
      console.log(e);
    }
  }, [lucid, toAccount, lovelace]);

  const sendTransactionUnLock = useCallback(async () => {
    if (!lucid || !toAccount || !lovelace) return;

    // const privateKey = lucid.utils.generatePrivateKey();

    try {
      const publicKeyHash = lucid.utils.getAddressDetails(
        await lucid.wallet.address()
      ).paymentCredential!.hash;
      // const validator = await readValidator();
      const validator = plutus.validators[0];
      const into = {
        type: 'PlutusV2',
        script: toHex(cbor.encode(fromHex(validator.compiledCode))),
    }
      const datum = Data.to(new Constr(0, [publicKeyHash]));
      const txHash = await lock(lucid, BigInt(lovelace), {
        into: into as any,
        owner: datum,
      });
      console.log(`1 tADA locked into the contract at:
        Tx ID: ${txHash}
        Datum: ${datum}
    `);
    } catch (e) {
      console.log(e);
    }
  }, [lucid, toAccount, lovelace]);

  const lovelaceSetter = useCallback((value: string) => {
    setError(undefined);
    setSuccessMessage(undefined);

    const parsed = parseInt(value);
    if (isNaN(parsed)) return;
    setLovelace(parsed);
  }, []);

  const toAccountSetter = useCallback((value: string) => {
    setError(undefined);
    setSuccessMessage(undefined);
    setToAccount(value);
  }, []);

  return {
    error,
    successMessage,
    lovelace,
    setLovelace: lovelaceSetter,
    toAccount,
    setToAccount: toAccountSetter,
    sendTransactionLock,
  };
};

export { useTransactionLockSender };
