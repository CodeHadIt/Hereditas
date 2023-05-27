// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**@title A sample NFT contract
 * @author Code HadIt
 * @notice This contract is for creating an NFT collection
 */

contract HereditasCollective is ERC721URIStorage {
    uint public tokenCount;

    constructor() ERC721("Hereditas", "HDT") {}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);
    }

    function totalSupply() external view returns(uint) {
        return tokenCount;
    }
}