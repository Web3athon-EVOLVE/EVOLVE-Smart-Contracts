import React from 'react'
import { useState, useEffect } from 'react'
import { Form, ButtonGroup, Button, InputGroup } from 'react-bootstrap';

export default function StakeForm() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null
    return (
        <div>
        <p>Stake Your $EVOLVE Tokens</p>
        <Form className="p-4">
            {/* Input Stake Amount */}
            <Form.Group className = 'pt-2 text-sm uppercase text-gray-500' controlId="stakeAmount">
                <Form.Label variant="secondary" className="w-100 text-end text-muted" >Balance: </Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="text" 
                        placeholder="0.0" 
                        autoComplete="off"
                        title="balance not staked"
                    />
                    <InputGroup.Text> $EVOLVE TOKENS </InputGroup.Text>
                </InputGroup>
            </Form.Group>
            {/* STAKE AMOUNT */}
            <ButtonGroup>
                <Button onClick={() => this.setAmount(25)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">25%</Button> 
                <Button onClick={() => this.setAmount(50)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">50%</Button> 
                <Button onClick={() => this.setAmount(75)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">75%</Button> 
                <Button onClick={() => this.setAmount(100)} className="w-20 m-2 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded">Max</Button> 
            </ButtonGroup>
            {/* Submit Transaction */}
            <Button className="w-20 m-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold rounded">Stake</Button>
        </Form>
    </div>
    )
}
