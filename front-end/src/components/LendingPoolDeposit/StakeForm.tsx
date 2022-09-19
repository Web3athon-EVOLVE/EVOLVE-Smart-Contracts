import React, { useState, useEffect } from 'react'
import { Form, ButtonGroup, Button, InputGroup } from 'react-bootstrap';

export default function StakeForm(wMatic) {
    const [mounted, setMounted] = useState(false);
    const [amount, setQuantity] = useState('');
    const [validAmount, setValidAmount] = useState(false);
    const [formType, setForm] = useState('stake');
    const title = (formType === 'stake') ? "Stake" : (formType === 'unstake') ? "Unstake" : undefined;

    useEffect(() => setMounted(true), []);

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

    function submitForm () {
        if (formType === 'stake') {
            submitStake()
        } else if (formType === 'unstake') {
            submitUnstake()
        }
    }

    function submitStake() {
        if (!validAmount) {
            console.log("Invalid token amount");
            return
        }
        setForm('unstake');
        console.log("TODO: STAKE");
        console.log("AMOUNT: ", amount);
    }

    function submitUnstake() {
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
        <p>Contribute To The Pool By Staking Your $EVOLVE Tokens</p>
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
                    <InputGroup.Text> $EVOLVE TOKENS </InputGroup.Text>
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
                className="w-20 m-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold rounded">{title}
            </Button>
        </Form>
    </div>);
}
