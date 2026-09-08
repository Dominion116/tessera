import Wordmark from "@/components/landing/wordmark";
import { CHAIN_ID, CONTRACT_ADDRESS } from "@/lib/poap-data";
import { shortAddress } from "@/lib/format";

const FooterBrand = () => {
  return (
    <div className="flex flex-col gap-5">
      <Wordmark className="text-white" />
      <p className="max-w-sm text-base leading-7 text-teal-100/70">
        Proof you were there, stored entirely onchain. Create a POAP, hand it
        out at your event, keep it forever.
      </p>
      <dl className="flex flex-col gap-1 pt-2 text-sm">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <dt className="text-teal-100/50">Contract</dt>
          <dd className="font-mono tabular-nums text-teal-100/80 select-all">
            {shortAddress(CONTRACT_ADDRESS)}
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <dt className="text-teal-100/50">Network</dt>
          <dd className="tabular-nums text-teal-100/80">
            Base, chain {CHAIN_ID}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default FooterBrand;
