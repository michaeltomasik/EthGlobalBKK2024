import React, { useState, useRef, useCallback } from 'react';
import { Container, Sprite, Text, useTick } from '@pixi/react';
import { useWriteContract } from 'wagmi';

import Token from '../assets/token3.png'
import * as PIXI from 'pixi.js';

const bunnyTexture = PIXI.Texture.from(Token) //PIXI.Texture.from('https://pixijs.com/assets/bunny.png');

const style = new PIXI.TextStyle({
    fill: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    // Add any other required properties if needed
  });
const DraggableBunny = ({ initialX, initialY, name, onCollision, onFeed, tokenAddress }) => {

    const positionRef = useRef({ x: initialX, y: initialY });
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    // Start dragging and calculate offset
    const handlePointerDown = useCallback((event) => {
        setIsDragging(true);
        const initialOffset = event.data.getLocalPosition(containerRef.current);
        dragOffset.current = {
            x: initialOffset.x,
            y: initialOffset.y,
        };
    }, []);

    // Update position based on pointer movement
    const handlePointerMove = useCallback((event) => {
        if (isDragging) {
            const newPosition = event.data.getLocalPosition(containerRef.current.parent);
            positionRef.current = {
                x: newPosition.x - dragOffset.current.x,
                y: newPosition.y - dragOffset.current.y,
            };
            onCollision(positionRef.current);
        }
    }, [isDragging, onCollision]);

    // End dragging
    const handlePointerUp = useCallback(() => {
        if (isDragging) {
            onFeed(positionRef.current, );
        }
        setIsDragging(false);
    }, [isDragging, onFeed]);

    // Smoothly update the container's position on each frame
    useTick(() => {
        if (containerRef.current) {
            containerRef.current.x = positionRef.current.x;
            containerRef.current.y = positionRef.current.y;
        }
    });

    return (
        <Container ref={containerRef} interactive>
            <Sprite
                texture={bunnyTexture}
                anchor={0.5}
                scale={0.1}
                interactive
                cursor="pointer"
                pointerdown={handlePointerDown}
                pointermove={handlePointerMove}
                pointerup={handlePointerUp}
                pointerupoutside={handlePointerUp}
            />
            <Text
                text={name}
                anchor={0.5}
                y={-50} // Position the text above the bunny
                style={style}
            />
        </Container>
    );
};

export default DraggableBunny;