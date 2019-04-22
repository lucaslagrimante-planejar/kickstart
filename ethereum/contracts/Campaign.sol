pragma solidity ^0.4.25;


contract CampaignFactory {

    address[] public deployedCampaigns;

    function createCampaign(uint mininum, string memory name) public {
        Campaign newCampaign = new Campaign(msg.sender, mininum, name);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaingns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function getDeployedCampaignsCount() public view returns (uint256) {
        return deployedCampaigns.length;
    }
}


contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        // quem já votou no request
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    string public campaignName;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    //funcoes modificadoras sao colocadas normalmente acima da constructora
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(address creator, uint minimum, string memory name) public {
        manager = creator;
        minimumContribution = minimum;
        campaignName = name;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(string memory description, uint value, address recipient)
    public restricted
    {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        // é um apoiador da campanha?
        require(approvers[msg.sender]);
        //já votou nessa campanha?
        require(!request.approvals[msg.sender]);

        if (!request.approvals[msg.sender]) {
            // conta mais um na lista de aprovadores
            request.approvalCount++;
            // adiciona ao mapeamento de quem já votou
            request.approvals[msg.sender] = true;
        }
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        string, uint, uint, uint, uint, address
        ) {
        return (
            campaignName,
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
