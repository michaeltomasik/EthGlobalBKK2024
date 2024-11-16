import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Container, Sprite, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useAccount, useBalance, useWriteContract } from 'wagmi';

import moodeng_feed from '../public/assets/moodeng_feed.png'
import moodeng_default from '../public/assets/feed_me.png'
import background from '../public/assets/background3.png'
import DraggableBunny from './DraggableBunny';
import {ethers} from 'ethers'
import { Abi, parseAbi } from 'viem'

const bunnyTexture = PIXI.Texture.from('https://pixijs.com/assets/bunny.png');
const openMouthBunnyTexture = PIXI.Texture.from('https://pixijs.com/assets/eggHead.png'); // Replace with open-mouth image URL

const moodengFeed = PIXI.Texture.from(moodeng_feed);
const moodengDefault = PIXI.Texture.from(moodeng_default);
const backgroundStage = PIXI.Texture.from(background);
// const erc20Abi = [
//     "function transferFrom(address src, address dst, uint wad) public returns (bool)",
// ];
const style = new PIXI.TextStyle({
    fill: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    // Add any other required properties if needed
  });
  
import erc20Abi from '../contracts/erc20.json'
const ERC20_ABI: Abi = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
    stateMutability: 'nonpayable', 
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
    stateMutability: 'nonpayable', 
  },
  // Add other ERC-20 methods if required
];

const StaticBunny = ({ x, y, isOpenMouth }) => {
    return (
        <Sprite
            texture={isOpenMouth ? moodengFeed : moodengDefault}
            x={x}
            y={y}
            anchor={0.5}
            scale={0.5}
        />
    );
};

const PixiDragAndDrop = ({
    tokenBalances = [],
}) => {
    const { writeContract } = useWriteContract()
    const { address, isConnected } = useAccount();

    const [isBunnyMouthOpen, setIsBunnyMouthOpen] = useState(false);
    const [feedCount, setFeedCount] = useState(0);
    const [shitTokens, setShitTokens] = useState(tokenBalances);
    const staticBunnyPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    useEffect(() => {
        setShitTokens(tokenBalances)
    }, [tokenBalances])
    // Check collision with the static bunny
    const checkCollision = ({ x, y }) => {
        const dx = x - staticBunnyPosition.x;
        const dy = y - staticBunnyPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 100; // Adjust based on bunny size

        // Open the mouth if close enough
        setIsBunnyMouthOpen(distance < threshold);
    };

    // Feed the static bunny if the draggable bunny is close enough on release
    const feedBunny = async (position, name, tokenBalance, contractAddress) => {
        const dx = position.x - staticBunnyPosition.x;
        const dy = position.y - staticBunnyPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 100;

        // If the draggable bunny is close enough on release, increment feed count and mark it as fed
        if (distance < threshold) {
            // writeContract({ 
            //     abi: erc20Abi,
            //     address: contractAddress,
            //     functionName: 'transfer',
            //     args: [
            //       BigInt('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'),
            //       tokenBalance,
            //     ],
            //  })
             const config = {
                address: contractAddress,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [
                    '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
                    ethers.parseUnits(tokenBalance || "0", 18)], // Adjust decimals
              };
              console.log(config)
            // const tokenId = '123123'
            // writeContract({
            // address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
            // abi: parseAbi(['function mint(uint256 tokenId)']),
            // functionName: 'mint',
            // args: [BigInt(tokenId)],
            // })
             console.log('returnObj', contractAddress, tokenBalance)

            setFeedCount((count) => count + 1);

            // Mark the specific bunny as fed and reset the static bunny's mouth state
            setShitTokens((tokens) =>
                tokens.map((token) => (token.tokenName === name ? { ...token, fed: true } : token))
            );
            setIsBunnyMouthOpen(false); // Close the mouth after feeding
            // @ts-ignore
            const { hash } = await writeContract(config); 
            console.log(hash)
        }
    };
    console.log('shitTokens', shitTokens)
    return (
        <div className='zoo-stage'>
            <Stage width={window.innerWidth} height={window.innerHeight}>
            <Sprite
                texture={backgroundStage}
                width={window.innerWidth} height={window.innerHeight}
            />

                {/* Static bunny with mouth-changing effect */}
                <StaticBunny x={staticBunnyPosition.x} y={staticBunnyPosition.y} isOpenMouth={isBunnyMouthOpen} />
                
                {/* Render only unfed bunnies */}
                {shitTokens
                    .filter((token) => !token.fed)
                    .map(({ tokenName, tokenBalance, tokenContractAddress }) => (
                        <DraggableBunny
                            key={tokenName}
                            name={tokenName}
                            initialX={Math.random() * window.innerWidth}
                            initialY={Math.random() * window.innerHeight}
                            onCollision={checkCollision}
                            onFeed={async (position) => await feedBunny(position, tokenName, tokenBalance, tokenContractAddress)}
                            tokenAddress={tokenContractAddress}
                        />
                    ))}

                {/* Display feed count */}
                <Text
                    text={`Feed Count: ${feedCount}`}
                    x={50}
                    y={50}
                    style={style}
                />
            </Stage>
        </div>
    );
};

export default PixiDragAndDrop;