// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error WillsAddressZeroError();
error WillsInsufficientAmountError();
error WillsInvalidReleaseDateError(uint releaseDate, uint blockTimeStamp);
error WillsNotTokenOwnerError(address owner, address caller);
error WillsGiftNotDueError(uint blockTimeStamp, uint releaseDate);
error WillsNotBeneficiaryError(address beneficiary, address caller);
error WillsGiftAlreadyReleasedError();
error WillsNotTestatorError(address testator, address caller);

contract Will is ReentrancyGuard {

    address public owner;

    struct EtherGift {
        address payable testator;
        address payable beneficiary;
        uint amount;
        uint256 releaseDate;
        bool released;
    }

    struct FungibleTokenGift {
        IERC20 tokenAddress;
        address testator;
        address beneficiary;
        uint amount;
        uint256 releaseDate;
        bool released;
    }

    struct NFTGift {
        IERC721 contractAddress;
        address testator;
        uint tokenId;
        address payable beneficiary;
        uint releaseDate;
        bool released;
    }

    mapping(address => mapping(address => EtherGift[])) public etherGifts;
    mapping(address => mapping(address => FungibleTokenGift[])) public tokenGifts;
    mapping(address => mapping(address => NFTGift[])) public nftGifts;

    mapping(address => address[]) public listOfBeneficiaries;

    event EtherGiftCreated(address indexed testator, address indexed beneficiary, uint amount, uint releaseDate);
    event FungibleTokenGiftCreated(address indexed testator, address indexed contractAddress, address indexed beneficiary, uint amount, uint releaseDate);
    event NFTGiftCreated(address indexed testator, address indexed contractAddress, address indexed beneficiary, uint tokenId, uint releaseDate);

    event EtherGiftCancelled(address indexed testator, address indexed beneficiary, uint amount, uint releaseDate);
    event FungibleTokenGiftCancelled(address indexed testator, address indexed contractAddress, address indexed beneficiary, uint amount, uint releaseDate);
    event NFTGiftCancelled(address indexed testator, address indexed contractAddress, address indexed beneficiary, uint tokenId, uint releaseDate);

    event GiftReleased(address indexed beneficiary, string giftType, uint giftIndex);

    receive() external payable {}

    constructor() {
        owner = msg.sender;
    }

    function createEtherGift(address payable _beneficiary, uint256 _amount, uint256 _releaseDate) public payable nonReentrant {
        if(_beneficiary == address(0)){
            revert WillsAddressZeroError();
        }
        if(_amount <= 0) {
            revert WillsInsufficientAmountError();
        }
        if(block.timestamp >= _releaseDate){
            revert WillsInvalidReleaseDateError(_releaseDate, block.timestamp);
        }
        payable(address(this)).transfer(_amount);
        EtherGift memory newEtherGift = EtherGift({
            testator: payable(msg.sender),
            beneficiary: _beneficiary,
            amount: _amount,
            releaseDate: _releaseDate,
            released: false
        });
        //Thinkered
        etherGifts[msg.sender][_beneficiary].push(newEtherGift);
        bool hasBeneficiary = false;
        for(uint i = 0 ; i < listOfBeneficiaries[msg.sender].length; i++){
            if(listOfBeneficiaries[msg.sender][i] == _beneficiary) {
                hasBeneficiary = true;
                break;
            }
        }
        if(!hasBeneficiary) {
            listOfBeneficiaries[msg.sender].push(_beneficiary);
        }
        emit EtherGiftCreated(msg.sender, _beneficiary, _amount, _releaseDate);
    }

    function releaseEther( uint _giftIndex, address _testator) public payable nonReentrant {
        //Thinkered
        EtherGift storage gift = etherGifts[_testator][msg.sender][_giftIndex];
        if(block.timestamp < gift.releaseDate) {
            revert WillsGiftNotDueError(block.timestamp, gift.releaseDate);
        }
        if(msg.sender != gift.beneficiary){
            revert WillsNotBeneficiaryError(gift.beneficiary, msg.sender);
        }
        if(gift.released) {
            revert WillsGiftAlreadyReleasedError();
        }
        gift.released = true;
        gift.beneficiary.transfer(gift.amount);
        emit GiftReleased(gift.beneficiary, "Ether", _giftIndex);
    }

    function cancelEtherGift(uint _giftIndex, address _beneficiary) public nonReentrant{
        EtherGift storage gift = etherGifts[msg.sender][_beneficiary][_giftIndex];
        if(msg.sender != gift.testator){
            revert WillsNotTestatorError(gift.testator, msg.sender);
        }
        if(gift.released) {
            revert WillsGiftAlreadyReleasedError();
        }
        gift.testator.transfer(gift.amount);
        EtherGift[] storage giftsArray = etherGifts[msg.sender][_beneficiary];
        if (_giftIndex < giftsArray.length - 1) {
            giftsArray[_giftIndex] = giftsArray[giftsArray.length - 1];
        }
        delete giftsArray[giftsArray.length - 1];
        giftsArray.pop();
        emit EtherGiftCancelled(msg.sender, gift.beneficiary, gift.amount, gift.releaseDate);
    }


    function createFungibleTokenGift(IERC20 _tokenAddress, address _beneficiary, uint256 _amount, uint256 _releaseDate) public nonReentrant{
        if(_beneficiary == address(0)){
            revert WillsAddressZeroError();
        }
        if(_amount <= 0) {
            revert WillsInsufficientAmountError();
        }
        if(block.timestamp >= _releaseDate){
            revert WillsInvalidReleaseDateError(_releaseDate, block.timestamp);
        }
        _tokenAddress.transferFrom(msg.sender, address(this), _amount);
        FungibleTokenGift memory newTokenGift = FungibleTokenGift({
            testator: msg.sender,
            tokenAddress: _tokenAddress,
            beneficiary: _beneficiary,
            amount: _amount,
            releaseDate: _releaseDate,
            released: false
        });
        tokenGifts[msg.sender][_beneficiary].push(newTokenGift);
        bool hasBeneficiary = false;
        for(uint i = 0 ; i < listOfBeneficiaries[msg.sender].length; i++){
            if(listOfBeneficiaries[msg.sender][i] == _beneficiary) {
                hasBeneficiary = true;
                break;
            }
        }
        if(!hasBeneficiary) {
            listOfBeneficiaries[msg.sender].push(_beneficiary);
        }
        emit FungibleTokenGiftCreated(msg.sender, address(_tokenAddress),_beneficiary , _amount, _releaseDate);
    }


    function releaseFungibleTokenGift(uint _giftIndex, address _testator) public nonReentrant {
        FungibleTokenGift storage gift = tokenGifts[_testator][msg.sender][_giftIndex];
        if(block.timestamp < gift.releaseDate) {
            revert WillsGiftNotDueError(block.timestamp, gift.releaseDate);
        }
        if(msg.sender != gift.beneficiary){
            revert WillsNotBeneficiaryError(gift.beneficiary, msg.sender);
        }
        if(gift.released) {
            revert WillsGiftAlreadyReleasedError();
        }
        gift.released = true;
        gift.tokenAddress.transfer(msg.sender, gift.amount);
        emit GiftReleased(gift.beneficiary, "ERC20 Token", _giftIndex);
    }


    function cancelFungibleTokenGift(uint _giftIndex, address _beneficiary) public nonReentrant {
        FungibleTokenGift storage gift = tokenGifts[msg.sender][_beneficiary][_giftIndex];
        if(msg.sender != gift.testator){
            revert WillsNotTestatorError(gift.testator, msg.sender);
        }
        if(gift.released) {
            revert WillsGiftAlreadyReleasedError();
        }
        gift.tokenAddress.transfer(gift.testator, gift.amount);
        FungibleTokenGift[] storage giftsArray = tokenGifts[msg.sender][_beneficiary];
        require(_giftIndex < giftsArray.length, "Index out of bounds");
        if (_giftIndex < giftsArray.length - 1) {
            giftsArray[_giftIndex] = giftsArray[giftsArray.length - 1];
        }
        delete giftsArray[giftsArray.length - 1];
        giftsArray.pop();
        emit FungibleTokenGiftCancelled(msg.sender, address(gift.tokenAddress) , gift.beneficiary, gift.amount, gift.releaseDate);
    }


    function createNFTGift(IERC721 _nftContract, address _beneficiary, uint _tokenId, uint _releaseDate) public nonReentrant {
        if(_beneficiary == address(0)){
            revert WillsAddressZeroError();
        }
        if(block.timestamp >= _releaseDate){
            revert WillsInvalidReleaseDateError(_releaseDate, block.timestamp);
        }
        if(_nftContract.ownerOf(_tokenId) != msg.sender) {
            revert WillsNotTokenOwnerError(_nftContract.ownerOf(_tokenId), msg.sender);
        }
        _nftContract.transferFrom(msg.sender, address(this), _tokenId);
        NFTGift memory newNftGift = NFTGift({
            testator: msg.sender,
            contractAddress: _nftContract,
            tokenId: _tokenId,
            beneficiary: payable(_beneficiary),
            releaseDate: _releaseDate,
            released: false
        });
        nftGifts[msg.sender][_beneficiary].push(newNftGift);
        bool hasBeneficiary = false;
        for(uint i = 0 ; i < listOfBeneficiaries[msg.sender].length; i++){
            if(listOfBeneficiaries[msg.sender][i] == _beneficiary) {
                hasBeneficiary = true;
                break;
            }
        }
        if(!hasBeneficiary) {
            listOfBeneficiaries[msg.sender].push(_beneficiary);
        }
        emit NFTGiftCreated(msg.sender, address(_nftContract),_beneficiary , _tokenId, _releaseDate);
    }


    function releaseNFTGift(uint256 _giftIndex, address _testator) public nonReentrant {
        NFTGift storage gift = nftGifts[_testator][msg.sender][_giftIndex];
        if(block.timestamp < gift.releaseDate) {
            revert WillsGiftNotDueError(block.timestamp, gift.releaseDate);
        }
        if(msg.sender != gift.beneficiary){
            revert WillsNotBeneficiaryError(gift.beneficiary, msg.sender);
        }
        if(gift.released) {
            revert WillsGiftAlreadyReleasedError();
        }
        gift.released = true;
        gift.contractAddress.transferFrom(address(this), gift.beneficiary,gift.tokenId);
        emit GiftReleased(gift.beneficiary, "NFT", _giftIndex);
    }

    function cancelNFTGift(uint _giftIndex, address _beneficiary) public nonReentrant {
        NFTGift storage gift = nftGifts[msg.sender][_beneficiary][_giftIndex];
        if(msg.sender != gift.testator){
            revert WillsNotTestatorError(gift.testator, msg.sender);
        }
        if(gift.released) {
            revert WillsGiftAlreadyReleasedError();
        }
        gift.contractAddress.transferFrom(address(this), gift.testator, gift.tokenId);
        NFTGift[] storage giftsArray = nftGifts[msg.sender][_beneficiary];
        if (_giftIndex < giftsArray.length - 1) {
            giftsArray[_giftIndex] = giftsArray[giftsArray.length - 1];
        }
        delete giftsArray[giftsArray.length - 1];
        giftsArray.pop();
        emit NFTGiftCancelled(msg.sender, address(gift.contractAddress) , gift.beneficiary, gift.tokenId, gift.releaseDate);
    }


    function getGiftLength(string memory _type, address _testator, address _beneficiary) external view returns(uint){
        if(keccak256(bytes(_type)) == keccak256(bytes("NFT"))) {
            NFTGift[] storage nft = nftGifts[_testator][_beneficiary];
            return nft.length;
        } else if (keccak256(bytes(_type)) == keccak256(bytes("ERC20"))){
            FungibleTokenGift[] storage tokens = tokenGifts[_testator][_beneficiary];
            return tokens.length;
        } else {
            EtherGift[] storage ethers = etherGifts[_testator][_beneficiary];
            return ethers.length;
        }
    }

    function getListOfBeneficiaries(address _testator) external view returns(uint) {
        return listOfBeneficiaries[_testator].length;
    }

}
