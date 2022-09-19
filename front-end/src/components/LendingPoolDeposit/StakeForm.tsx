import React, { useState, useEffect } from 'react'

import { Form, ButtonGroup, Button, InputGroup } from 'react-bootstrap';
import Alert from "../Utils/Alert";

import { useContract, useSigner } from 'wagmi'
import { ethers } from "ethers";

import { mumbaiContractAddress } from "../../../../smart-contracts/utils/contractAddress";
import { tokenAddresses } from "../../../../smart-contracts/utils/tokenAddresses";

import abiJSON from "../../../../smart-contracts/artifacts/contracts/CommunityPool.sol/CommunityPool.json";
import IERC_JSON from "../../../../smart-contracts/artifacts/contracts/interfaces/IERC20.sol/IERC20.json";

export default function StakeForm(wMatic) {
    // component states
    const [mounted, setMounted] = useState(false);
    const [amount, setQuantity] = useState('');
    const [validAmount, setValidAmount] = useState(false);
    const [formType, setForm] = useState('stake');
    // transaction states
    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(null);
    // constants
    const title = (formType === 'stake') ? "Approve & Deposit" : (formType === 'unstake') ? "Undeposit & Retrieve Rewards" : undefined;
    const WMATIC_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["wMATIC"];

    useEffect(() => setMounted(true), []);

    // Lending Pool Contract Setup
    const signer = useSigner();
    const contractOnMumbai = useContract({
        addressOrName: mumbaiContractAddress,
        contractInterface: abiJSON.abi,
        signerOrProvider: signer.data,
    });

    // IERC20 Contract Setup
    const IERC20_Contract = useContract({
        addressOrName: WMATIC_TOKEN,
        contractInterface: IERC_JSON.abi,
        signerOrProvider: signer.data,
    });

    // Form Functions
    function setAmount (perc) {
        const amount = Math.floor(Number(wMatic.balance) * perc) / 100;
        let isValid = !isNaN(amount) && amount > 0;
        console.log(amount, isValid);
        setValidAmount(isValid);
        setQuantity(isNaN(amount)? '' : amount.toString());
    }

    function updateAmount (e) {
        let amount = Math.floor(Number(e.target.value) * 100) / 100;
        let isValid = !isNaN(amount) && amount >= 0;
        console.log(amount, isValid);
        setValidAmount(isValid);
        setQuantity(e.target.value);
    }

    async function submitForm () {
        if (formType === 'stake') {
            submitStake()
        } else if (formType === 'unstake') {
            submitUnstake()
        }
    }

    async function submitStake() {
        if (!validAmount) {
            console.log("Invalid token amount");
            return
        }
        try {
            if(IERC20_Contract) {
                console.log("Approve CommunityPool Contract to spend Caller's Tokens: ");
                let IERC20_TXN = await IERC20_Contract.approve(mumbaiContractAddress,  ethers.utils.parseUnits(amount));
                setLoading(true);
                console.log("Minting...", IERC20_TXN.hash);
                let IERC20_WAIT = await IERC20_TXN.wait();
                console.log("Minted -- ", IERC20_TXN.hash);
                setSuccess(true);
                setLoading(false);
                setMessage("Successfully gave permission to EVOLVE to deposit your funds and earn rewards...");
            }
            else {
                console.log("Error getting contract.");
            }
        }
        catch (error) {
            setSuccess(false);
            setMessage(`There was an error in giving permission to EVOLVE to deposit your funds: ${error.message}`);
            setLoading(false);
            console.log(error);
        }
        try {
            if(mumbaiContractAddress) {
                console.log("Depositing into Community Pool: ");
                let contractOnMumbai_TXN = await contractOnMumbai.poolDeposit(WMATIC_TOKEN, ethers.utils.parseUnits(amount), { gasLimit: 2074040 });
                setLoading(true);
                console.log("Minting...", contractOnMumbai_TXN.hash);
                let contractOnMumbai_WAIT = await contractOnMumbai_TXN.wait();
                console.log("Minted -- ", contractOnMumbai_TXN.hash);
                setSuccess(true);
                setLoading(false);
                setForm('unstake');
                setMessage("Congratulations, your funds were successfully deposited! You are now earning 5% APY.");
            }
            else {
                console.log("Error getting contract.");
            }
        }
        catch (error) {
            setSuccess(false);
            setMessage(`There was an error during depositing your funds into our EVOLVE Pool: ${error.message}`);
            setLoading(false);
            console.log(error);
        }
    }

    async function submitUnstake() {
        if (!validAmount) {
            console.log("Invalid token amount");
            return
        }
        setForm('stake');
        console.log("TODO: UNSTAKE");
        console.log("AMOUNT: ", amount);
    }

    if (!mounted) return null
    return (
        <div>
        <p>Contribute To The Pool By Staking Your EVOLVE Tokens</p>
        <Form className="p-4">
            {/* Input Stake Amount */}
            <Form.Group className = 'pt-2 text-sm uppercase' controlId="stakeAmount">
                <Form.Label variant="secondary" className="w-100 text-end" >Balance: </Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text" 
                        placeholder="0.0" 
                        autoComplete="off"
                        onChange={e => updateAmount(e)}
                        value={amount}
                        title="balance not staked"
                    />
                    <InputGroup.Text> EVOLVE TOKENS </InputGroup.Text>
                </InputGroup>
            </Form.Group>
            {/* DEPOSIT AMOUNT */}
            <ButtonGroup>
                <Button onClick={() => setAmount(25)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">25%</Button> 
                <Button onClick={() => setAmount(50)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">50%</Button> 
                <Button onClick={() => setAmount(75)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">75%</Button> 
                <Button onClick={() => setAmount(100)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">Max</Button> 
            </ButtonGroup>
            {/* Submit Transaction */}
            <Button
                onClick={()=>submitForm()} 
                className="w-40 m-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold rounded">{title}
            </Button>
        </Form>
        {loading && (
          <Alert
            alertType={"loading"}
            alertBody={"Please wait..."}
            triggerAlert={true}
            color={"white"}
          />
        )}
        {success && (
          <Alert
            alertType={"success"}
            alertBody={message}
            triggerAlert={true}
            color={"palegreen"}
          />
        )}
        {success === false && (
          <Alert
            alertType={"failed"}
            alertBody={message}
            triggerAlert={true}
            color={"palevioletred"}
          />
        )}
    </div>);
}
