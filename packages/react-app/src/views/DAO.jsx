import { Button, Card,  List, Row, Col, Descriptions, Input, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { Address, AddressInput, Balance, EtherInput } from "../components";
import { ethers } from "ethers";


export default function DAO({ contractAddress, price, readContracts, writeContracts, mainnetProvider, localProvider, processedDataSet, address, tx, blockExplorer}) {
  
    const [ toAddress, setToAddress ] = useState();
    const [ toAddKickAddress, setToAddKickAddress ] = useState();
    const [ memberInfo, setMemberInfo ] = useState();
    const [ memberReason, setMemberReason ] = useState();
    const [ showMemberInfo, setShowMemberInfo ] = useState("none");

    const [ processProposalId, setProcessProposalId ] = useState();
    const [ proposalSubmitDetails, setProposalSubmitDetails ] = useState();
    const [ amount, setAmount ] = useState();

    const [ payoutResult, setPayoutResult ] = useState();
    const [ payoutClicked, setPayoutClicked ] = useState("none");

    const [newFacetAddress, setnewFacetAddress ] = useState()
    useEffect(async() => {
        if (readContracts) {
        const AddingFacet = await readContracts.AddingFacet
        if(AddingFacet) {
                setnewFacetAddress(AddingFacet.address)
                return AddingFacet.address
        } 
    }
    });
    
    async function voteYes(proposalId) {
        const result = await tx(writeContracts.PowDAOFacet.submitVote(proposalId, 1));
        console.log(result)
    }

    async function voteNo(proposalId) {
        const result = await tx(writeContracts.PowDAOFacet.submitVote(proposalId, 2));
        console.log(result)
    }

    return (
        <div style={{margin:"0px", margin:"0px"}}>
            
            <Row justify="center">
                <Col span={6} style={{margin:"24px"}}>
                    <Card bordered title="Members"> 
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddress}
                            onChange={setToAddress}
                        />
                        <Button onClick={ async ()=>{
                            console.log(toAddress)
                            const result = await readContracts.PowDAOFacet.members(toAddress);
                            setMemberInfo(parseInt(result[0]))
                            console.log(parseInt(result[0]))
                            setShowMemberInfo("block")
                        }}>
                            Search
                        </Button>
                        <div style={{fontSize:"16px", margin:"12px", display:showMemberInfo}} >
                        {memberInfo == 1 ? toAddress+" is apart of the PowDAOFacet ????" : "This address is NOT apart of the PowDAOFacet"}
                        </div>
                    </Card >
                </Col>
                <Col span={6} style={{margin:"24px"}}>
                    <Card bordered title="Add/Kick Members">
                        <AddressInput
                            autoFocus
                            ensProvider={mainnetProvider}
                            placeholder="Enter address"
                            value={toAddKickAddress}
                            onChange={setToAddKickAddress}
                        />
                        <div style={{margin:"8px"}}>
                        <Input 
                        onChange={ (e) =>{
                            setMemberReason(e.target.value)
                        }}
                        placeholder="Enter details."
                        />
                        </div>
                        <Button onClick={ async ()=>{
                            const result = await tx (writeContracts.PowDAOFacet.addMember(toAddKickAddress, memberReason));
                            console.log(result)
                        }}>
                            Add
                        </Button>
                        <Button onClick={ async ()=>{
                            const result = await tx (writeContracts.PowDAOFacet.kickMember(toAddKickAddress, memberReason));
                            console.log(result)
                        }}>
                            Kick
                        </Button>
                    </Card >
                </Col>
            </Row>
            
            <Row justify="center" style={{margin:"18px"}}>
                <Col span={20}>
                    <Card title="Vote"> 
                        <List
                        dataSource={processedDataSet} // Only setting this data on proposal submit, never updated when proposal is processed.
                        header={<div >Proposal ID  //  Proposal Details</div>}
                        renderItem={item => {
                            return (
                                <List.Item key={item.args["proposalId"]} actions={[
                                    <Button onClick={()=>{voteYes(parseInt(item.args["proposalId"]))}}>
                                        Yes
                                    </Button>,
                                    <Button onClick={()=>{voteNo(parseInt(item.args["proposalId"]))}}>
                                        No
                                    </Button>
                                ]}>
                                    <div style={{margin:"8px"}}>
                                        ID: {parseInt(item.args["proposalId"])}
                                    </div>
                                    <Address address={item.args["proposer"]} ensProvider={mainnetProvider} fontSize={18}/>
                                    <div style={{margin:"8px"}}>
                                        {item.args["details"]}
                                    </div>
                                    <div style={{margin:"8px"}}>
                                        {ethers.utils.formatEther(""+item.args["paymentRequested"])} ??
                                    </div>
                                    <div style={{margin:"8px"}}>
                                        {item.args['flags'][4] || item.args['flags'][5] ? 
                                            item.args['flags'][4]? <Tag color="cyan">Member Add</Tag> : <Tag color="red">Member Kick</Tag>
                                            : 
                                            <Tag color="orange">Work</Tag>}
                                    </div>
                                </List.Item>
                            );
                        }}
                        />
                    </Card >
                </Col>
            </Row>

            <Row justify="center" style={{margin:"24px"}}>
                <Col span={10}>
                    <Card title="Create Proposal/Request">
                        <Input 
                        onChange={(e)=>{
                            setProposalSubmitDetails(e.target.value)
                        }}
                        placeholder="Enter proposal details."
                        />
                        <div >
                        <EtherInput
                        price={price}
                        value={amount}
                        placeholder="Enter amount"
                        onChange={value => {
                        setAmount(value);
                        }}
                        />
                        </div>
                        
                        <Button onClick={ async ()=>{
                            const value = ethers.utils.parseEther("" + amount);
                            const result = await tx( writeContracts.PowDAOFacet.submitProposal(value, proposalSubmitDetails) )
                        }}>
                        Submit Proposal
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Row justify="center" style={{margin:"32px"}}>
                <Col span={4}>
                    <Card title="Process Proposal">
                        <Input 
                        style={{width:"140px"}}
                        onChange={(e)=>{
                            setProcessProposalId(e.target.value)
                        }}
                        placeholder="Enter Propsal ID"/>
                        <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAOFacet.processProposal(processProposalId), async update => {
                                console.log("???? Transaction Update:", update);
                                if (update && (update.status === "confirmed" || update.status === 1)) {
                                    const signatures = [];
                                    Object.keys(writeContracts.AddingFacet.interface.functions).map(key => {
                                      signatures.push(writeContracts.AddingFacet.interface.getSighash(key));
                                    });
                                    const diamondCutParams = [[newFacetAddress, 0, signatures]];
                                    tx(
                                      writeContracts.DiamondCutFacet.diamondCut(
                                        diamondCutParams,
                                        "0x0000000000000000000000000000000000000000",
                                        "0x",
                                      ),
                                    );
                                }
                              })
                            
                        }}>
                        Process & Upgrade Diamond
                        </Button>
                    </Card>
                </Col>
                <Col span={1}></Col>
                <Col >
                    <Card >
                        <div >
                            <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAOFacet.payout(address))
                            console.log(parseInt(result))
                            setPayoutResult(result)
                            setPayoutClicked("block")
                        }}>
                                Check Payout
                            </Button>
                            <div style={{fontSize:"16px", margin:"12px", display:payoutClicked}} >
                                {payoutResult > 0 ? ethers.utils.formatEther(""+payoutResult)+" ??" : "No payout is currently available."}
                            </div>
                        </div>
                        <Button onClick={ async ()=>{
                            const result = await tx(writeContracts.PowDAOFacet.getPayout(address))
                        }}
                        style={{margin:"4px"}}>
                            Get Paid
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Row justify="center" style={{margin:"8px", fontSize:"18px"}}>
                To deposit into the DAO, send funds to the smart contract! ????
            </Row>
            <Row justify="center" style={{margin:"0px", fontSize:"18px"}}>
            Etherscan Link: 
            </Row>
             
            <Row justify="center">
                <div style={{fontSize:"16px"}}>
                
                    <a href={"https://etherscan.io/address/"+contractAddress} target="blank"> 
                        <Address
                            address={contractAddress}
                            ensProvider={mainnetProvider}
                            blockExplorer={blockExplorer}
                            fontSize={18}
                        />
                    </a>
                </div>
            </Row>

        </div>
    );
}
