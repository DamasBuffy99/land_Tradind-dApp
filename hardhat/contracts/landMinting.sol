// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract landMinting is ERC721{
    event Minting(address indexed minter, uint indexed landId);
    string _baseTokenURI;
    uint public _tokenId;
    struct LandData {
        uint superficie;
    }
    mapping(uint=>LandData) public landDatas;
    constructor(string memory baseURI)ERC721("landNFT","LANDNFT"){
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns(string memory){
        return _baseTokenURI;
    }

    function mint(uint _superficie) public {
        _tokenId++;
        _safeMint(msg.sender,_tokenId);
        LandData storage landData = landDatas[_tokenId];
        landData.superficie = _superficie;
        emit Minting(msg.sender, _tokenId);
    }

    function tokenURI(uint tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId, ".json")) : "";
    }
}