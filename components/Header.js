import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row ">
            <h1 className="py-4 px-4 font-sans text-3xl">Decentralized Raffle</h1>
            <div className="ml-auto px-4 py-2">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
