import { subtask, task, types } from "hardhat/config";
import * as Helpers from './helpers';

task("deploy", "Deploy StakerInfo")
  .setAction(async (taskArgs, {ethers}) => {
        const signer = (await ethers.getSigners())[0];

        const sfc = '0xfc00face00000000000000000000000000000000';

        const stakerInfoFactory = await ethers.getContractFactory("StakerInfo", signer);
        const stakerInfo = await (await stakerInfoFactory.deploy(sfc)).deployed();

        console.log("StakerInfo deployed to:", stakerInfo.address);
    });

task("update-info", "Updating cfg info")
    .setAction(async (taskArgs, {ethers, network}) => {
        const signer = (await ethers.getSigners())[0];

        let stakerInfoAddress = '';
        if(network.name === "ultron") {
            stakerInfoAddress = '0x8346c42d1023BAfA955fF3623c96d54982AB8b0F';
        }
        else if(network.name === "ultron_testnet") {
            stakerInfoAddress = '0x33F0C573e9415497D30FB7C1bd4632b2F27dC689';
        }

        const stakerInfo = await ethers.getContractAt("StakerInfo", stakerInfoAddress, signer);

        const cfgUrl = 'https://files.b42.tech/fantom/config.json';
        
        await stakerInfo.updateInfo(cfgUrl);
        await Helpers.delay(4000);
        console.log(await stakerInfo.getInfo(1))
    });

task("change-owner", "Transfer ownership")
    .setAction(async (taskArgs, {ethers, network}) => {
        const signer = (await ethers.getSigners())[0];

        let stakerInfoAddress = '';
        if(network.name === "ultron") {
            stakerInfoAddress = '0x8346c42d1023BAfA955fF3623c96d54982AB8b0F';
        }
        else if(network.name === "ultron_testnet") {
            stakerInfoAddress = '0x33F0C573e9415497D30FB7C1bd4632b2F27dC689';
        }
        
        const stakerInfo = await ethers.getContractAt("StakerInfo", stakerInfoAddress, signer);

        const owner = '0x4CE535D6E2D47690e33CA646972807BeB264dFBf';

        await stakerInfo.transferOwnership(owner);
        await Helpers.delay(4000);
        console.log(await stakerInfo.owner())
    });