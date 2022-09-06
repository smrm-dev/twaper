pragma experimental ABIEncoderV2;

interface IOracleAggregator {
    struct Route {
        uint256 index;
        string dex;
        address[] path;
        bool[] reversed;
        uint256 weight;
        bool isActive;
    }

    function getRoutes(bool dynamicWeight)
        external
        view
        returns (Route[] memory routes_);
}
