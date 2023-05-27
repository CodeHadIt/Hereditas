// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error wwtbac_NotOwner();

/**@title A sample ERC20 contract
 * @author Code HadIt
 * @notice This contract is for creating an ERC20 token
 */
contract Token is ERC20 {

    address private owner;
    
    constructor() ERC20("Cryptonaire", "WWTBAC") {
        owner = msg.sender;
        uint mintAmount = 1e18;
        _mint(owner, mintAmount);
    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }

}