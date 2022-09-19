import React, { useState, useEffect } from 'react'
import { Form, ButtonGroup, Button, InputGroup } from 'react-bootstrap';
import { useContract, useSigner } from 'wagmi'
import { ethers } from "ethers";
import Alert from "../Utils/Alert";

import { tokenAddresses } from "../../../../smart-contracts/utils/tokenAddresses";

import IWMatic_JSON from "../../../../smart-contracts/artifacts/contracts/interfaces/IWMatic.sol/IWMatic.json";

export default function GetWMatic(matic) {
    // component states
    const [mounted, setMounted] = useState(false);
    const [amount, setQuantity] = useState('');
    const [validAmount, setValidAmount] = useState(false);
    // transaction states
    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(null);
    // constants
    const WMATIC_TOKEN = tokenAddresses["Polygon Mumbai"]["ERC20"]["wMATIC"];

    useEffect(() => setMounted(true), []);

    // WMATIC Contract Setup
    const signer = useSigner();
    const IWMatic_Contract = useContract({
        addressOrName: WMATIC_TOKEN,
        contractInterface: IWMatic_JSON.abi,
        signerOrProvider: signer.data,
    });

    // Component Functions
    function setAmount (perc) {
        const amount = Math.floor(Number(matic.balance) * perc) / 100;
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
        if (!validAmount) {
            console.log("Invalid token amount");
            return
        }
        try {
            if(IWMatic_Contract) {
                console.log("Getting wMATIC for by depositing 0.01 MATIC: ");
                let IWMatic_TXN = await IWMatic_Contract.deposit({"value": ethers.utils.parseUnits(amount)});
                setLoading(true);
                console.log("Minting...", IWMatic_TXN.hash);
                let IWMatic_WAIT = await IWMatic_TXN.wait();
                console.log("Minted -- ", IWMatic_TXN.hash);
                setSuccess(true);
                setLoading(false);
                setMessage("Successfully exchanged MATIC for wMATIC! Refresh Page To See Update or Check Your Wallet.");
            }
            else {
                console.log("Error getting contract.");
            }
        }
        catch (error) {
            setSuccess(false);
            setMessage(`There was an error exchanging MATIC for wMATIC: ${error.message}`);
            setLoading(false);
            console.log(error);
        }
    }

    if (!mounted) return null
    return (
        <div>
        <p>Exchange Your MATIC for wMATIC</p>
        <Form className="p-4">
            {/* Input Deposit Amount */}
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
                    <InputGroup.Text> MATIC </InputGroup.Text>
                </InputGroup>
            </Form.Group>
            {/* DEPOSIT MATIC in order to get wMATIC */}
            <ButtonGroup>
                <Button onClick={() => setAmount(25)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">25%</Button> 
                <Button onClick={() => setAmount(50)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">50%</Button> 
                <Button onClick={() => setAmount(75)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">75%</Button> 
                <Button onClick={() => setAmount(100)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">Max</Button> 
            </ButtonGroup>
            {/* Submit Transaction */}
            <Button
                onClick={()=>submitForm()} 
                className="w-40 m-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold rounded"> Get wMATIC
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
