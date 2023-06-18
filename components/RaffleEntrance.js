import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../Constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

export default function RaffleEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainIdInt = parseInt(chainIdHex).toString()
    const raffleAddress = chainIdInt in contractAddresses ? contractAddresses[chainIdInt][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntrancFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntrancFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntrancFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (
            await getRecentWinner({ onError: (error) => console.log(error) })
        ).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "transaction complete!",
            title: "tx Notification",
            position: "topR",
            icon: "Bell",
        })
    }

    return (
        <div>
            {raffleAddress ? (
                <div className="ml-10">
                    <button
                        className="bg-blue-200 hover:bg-blue-400 mt-2 px-3 py-2 font-medium rounded-xl font-sans  transition ease-in-out delay-150hover:-translate-y-1 hover:scale-110 duration-300"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin h-6 w-6 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <br />
                    <div className="font-sans mt-1">
                        Entrance Fee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div className="font-sans mt-1">Number of players : {numberOfPlayers}</div>
                    <div className="font-sans mt-1">Recent Winner : {recentWinner}</div>
                </div>
            ) : (
                <div>no Raffle address detected</div>
            )}
        </div>
    )
}
