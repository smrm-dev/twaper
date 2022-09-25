pragma experimental ABIEncoderV2;

interface IOracleAggregator {
    struct Route {
        uint256 index;
        string dex;
        address[] path;
        bool[] reversed;
        uint256[] fusePriceTolerance;
        uint256 weight;
        bool isActive;
    }

    function validPriceGap() external view returns (uint256);

    function getRoutes(bool dynamicWeight)
        external
        view
        returns (Route[] memory routes_);
}
