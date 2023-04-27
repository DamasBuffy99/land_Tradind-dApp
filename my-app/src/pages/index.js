import {Contract,providers,utils,BigNumber} from "ethers";
import Web3Modal from "web3modal";
import Head from "next/head";
import {useState,useEffect,useRef} from "react";
import styles from "../styles/Home.module.css";
import {
    LAND_MINTING_ABI,
    LAND_MINTING_CONTRACT_ADDRESS,
    LAND_TRADING_ABI,
    LAND_TRADING_CONTRACT_ADDRESS
} from "../../constants";

export default function Home(){
    const zero=BigNumber.from(0);
    const [walletConnected,setWalletConnected] = useState(false);
    const [loading,setLoading] = useState(false);
    const [landNumber,setLandNumber] = useState(0);
    const [landBalance, setLandBalance] = useState("0");
    const [selectTab,setSelectTab] = useState("");
    const [price,setPrice] = useState(zero);
    const [tickets,setTickets] = useState([]);
    const [yourLands,setYourLands] = useState([]);
    const [yourTickets,setYourTickets] = useState([]);
    const [superficie,setSuperficie] = useState(0);
    const web3ModalRef = useRef();

    const getProviderOrSigner = async(needProvider=false)=>{
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const {chainId} = await web3Provider.getNetwork();
        if(chainId !==5){
            console.log("Change the network to Goerli");
            throw new Error("Change network to Goerli");
        }
        if(needProvider){
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    const connectWallet = async()=>{
        try{
            await getProviderOrSigner();
            setWalletConnected(true);
        }catch(err){
            console.error(err);
        }
    };

    const getLandMintingContractInstance = (needProvider)=>{
        return new Contract(
            LAND_MINTING_CONTRACT_ADDRESS,
            LAND_MINTING_ABI,
            needProvider
        );
    };

    const getLandTradingContractInstance = (needProvider)=>{
        return new Contract(
            LAND_TRADING_CONTRACT_ADDRESS,
            LAND_TRADING_ABI,
            needProvider
        );
    };

    const sellLand = async(id,price) =>{
        try{
            const signer = await getProviderOrSigner(true);
            const landTradingContract = getLandTradingContractInstance(signer);
            const landMintingContract = getLandMintingContractInstance(signer);
            const txt = await landMintingContract.approve(LAND_TRADING_CONTRACT_ADDRESS,id);
            await txt.wait();
            const tx = await landTradingContract.sell(
                id,
                utils.parseEther(price.toString())
            );
            setLoading(true);
            await tx.wait();
            setLoading(false);

        }catch(err){
            console.error(err);
        }
    };

    const buyLand = async(id,price) =>{
        try{
            const signer = await getProviderOrSigner(true);
            const landTradingContract = getLandTradingContractInstance(signer);
            const landMintingContract = getLandMintingContractInstance(signer);
            const txt = await landMintingContract.approve(
                LAND_TRADING_CONTRACT_ADDRESS,
                utils.parseEther(price.toString())
            );
            await twt.wait();
            const tx = await landTradingContract.buy(id,{
                value: utils.parseEther(price.toString()),
            });
            setLoading(true);
            await tx.wait();
            setLoading(false);
            await landNftBalance();
        }catch(err){
            console.error(err);
        }
    };

    const cancelLandSelling = async(id) =>{
        try{
            const signer = await getProviderOrSigner(true);
            const landTradingContract = getLandTradingContractInstance(signer);
            const tx = await landTradingContract.cancelSelling(id);
            setLoading(true);
            await tx.wait();
            setLoading(false);

        }catch(err){
            console.error(err);
        }
    };

    const landNftBalance = async() =>{
        try{
            const provider = await getProviderOrSigner();
            const signer = await getProviderOrSigner(true);
            const landMintingContract = getLandMintingContractInstance(provider);
            const balance = await landMintingContract.getBalanceOf(signer.getAddress());
            setLandBalance(balance.toString());
        }catch(err){
            console.error(err);
        }
    };

    const mintLandNFT = async(superficie) =>{
        try{
            const signer = await getProviderOrSigner(true);
            const landMintingContract = getLandMintingContractInstance(signer);
            console.log("1");
            const tx = await landMintingContract.mint(superficie);
            setLoading(true);
            await tx.wait();
            console.log("2");
            setLoading(false);
            await checkNumberOfLands();
        }catch(err){
            console.error(err);
        }
    };
    //----------------------1
    const fechAllTickets = async() => {
        try{
            const tickets=[];
            for(let id=0;i<landNumber;i++){
                const ticket = await fechTicketById(id);
                tickets.push(ticket);
            }
            setTickets(tickets);
        }catch(err){
            console.error(err);
        }
    };

    const fechTicketById = async(id) =>{
        try{
            const provider = await getProviderOrSigner();
            const landMintingContract = getLandMintingContractInstance(provider);
            const landTradingContract = getLandTradingContractInstance(provider);
            const _price = await landTradingContract.price(id);
            const ticket = await landMintingContract.landDatas(id);  
            const parsedTicket = {
                ticketId: id,
                superficie: ticket.superficie.toString(),
                price: _price.toString(),
            }
            return parsedTicket;
        }catch(err){
            console.error(err);
        }
    }
    //--------------------2
    const fechAllYourLands = async() => {
        try{
            const yourLands=[];
            for(let id=0;i<landNumber;i++){
                const yourLand = await fechYourLandById(id);
                if(yourLand != null){
                    yourLands.push(yourLand);
                }       
            }
            setYourLands(yourLands);
        }catch(err){
            console.error(err);
        }
    };
    
    const fechYourLandById = async(id) =>{
        try{
            const provider = await getProviderOrSigner();
            const signer = await getProviderOrSigner(true);
            const address = await signer.getAddress();
            const landMintingContract = getLandMintingContractInstance(provider);
            const landTradingContract = getLandTradingContractInstance(provider);
            const _price = await landTradingContract.price(id);
            const yourLand= await landMintingContract.tokenOfOwnerByIndex(address,id);
            if(tokenId){
                const parsedYourLand = {
                    yourLandId: id,
                    superficie: yourLand.superficie.toString(),
                    price: _price.toString(),
                }
                return parsedYourLand;
            } 
            return null;  
        }catch(err){
            console.error(err);
        }
    };
    //--------------3
    const fechAllYourTickets = async() => {
        try{
            const yourTickets=[];
            for(let id=0;i<landNumber;i++){
                const yourTicket = await fechYourTicketsById(id);
                if(yourTicket != null){
                    yourTickets.push(yourTicket);
                }       
            }
            setYourTickets(yourTickets);
        }catch(err){
            console.error(err);
        }
    };
    
    const fechYourTicketsById = async(id) =>{
        try{
            const provider = await getProviderOrSigner();
            const signer = await getProviderOrSigner(true);
            const address = await signer.getAddress();
            const landMintingContract = getLandMintingContractInstance(provider);
            const landTradingContract = getLandTradingContractInstance(provider);
            const _price = await landTradingContract.price(id);
            const toSell = await landTradingContract.forSale(id);
            const yourLand= await landMintingContract.tokenOfOwnerByIndex(address,id);
            if(tokenId && toSell){
                const parsedYourTicket = {
                    yourLandId: id,
                    superficie: yourLand.superficie.toString(),
                    price: _price.toString(),
                }
                return parsedYourTicket;
            } 
            return null;  
        }catch(err){
            console.error(err);
        }
    };
    const checkNumberOfLands = async () =>{
        try{
            const provider = await getProviderOrSigner(false);
            const landMintingContract = getLandMintingContractInstance(provider);
            const _landNumber = await landMintingContract.totalNumber();
            setLandNumber(parseInt(_landNumber.toString())); 
        }catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
              network: "goerli",
              providerOptions: {},
              disableInjectedProvider: false,
            });
      
            connectWallet().then(() => {
              checkNumberOfLands();
            });
        }
    },[walletConnected]);

    useEffect(()=>{
        if(selectTab === "BuyLand"){
            fechAllTickets();
        }
        if(selectTab === "SellLand"){
            fechAllYourLands();
        }
    },[selectTab]);

    function renderTabs(){
        if(selectTab === "BuyLand"){
            return renderBuyLandTab();
        }else if(selectTab === "SellLand"){
            return renderSellLandTab();
        }
        return null;
    }

    function renderSellLandTab(){
        if(loading){
            return(
                <div className={styles.description}>
                    Loading..Waiting for transaction..
                </div>
            );
        }else{
            if(yourLands.length ===0) {
                return(
                    <div>
                        You don't have any land to sell !!!
                    </div>
                );
            }else{
                return(
                    <div className={styles.container}>
                        {yourLands.map((p,index)=>(
                            <div key={index} className={styles.card}>
                                <p>Ticket Id: {p.ticketId}</p>
                                <p>Land superficie: {p.superficie}</p>


                                <label>Sell your landNFT sell</label>
                                <input
                                    placeholder="0"
                                    type="number"
                                    onChange={(e)=>setPrice(BigNumber.from(e.target.value))}
                                />
                                <button className={styles.button} onClick={()=>sellLand(p.ticketId,price)}>
                                    Sell
                                </button>
                            </div>
                        ))}

                        {yourTickets.map((p,index)=>(
                            <div key={index} className={styles.card}>
                                <p>Ticket Id: {p.ticketId}</p>
                                <p>Land superficie: {p.superficie}</p>
                                <p>Land sell price: {utils.formatEther(p.price)} ETH</p>
                                <button className={styles.button} onClick={()=>cancelLandSelling(p.ticketId)}>
                                    Cancel selling
                                </button>
                            </div>
                        ))}
                    </div>
                );
            }
        }
    }

    function renderBuyLandTab(){
        if(loading){
            return(
                <div className={styles.description}>
                    Loading..Waiting for transaction..
                </div>
            );
        } else if(tickets.length===0){
            return(
                <div className={styles.description}>
                    No ticket have been created yet.
                </div>
            );
        }else{
            return(
                <div>
                    {tickets.map((p,index)=>(
                        <div key={index} className={styles.card}>
                            <p>Ticket Id: {p.ticketId}</p>
                            <p>Land superficie: {p.superficie}</p>
                            <p>Land sell price: {utils.formatEther(p.price)} ETH</p>
                            <button className={styles.button} onClick={()=>buyLand(p.ticketId,p.price)}>
                                Buy Land
                            </button>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return(
        <div>
            <Head>
                <title>Land Trading</title>
                <meta name="descripttion" content="Land Trading"/>
                <link rel="icon" href="./favicon.ico"/>
            </Head>
            <div>
                <div className={styles.main}>
                    <h1 className={styles.description}>Welcome to the land trading market place!</h1>
                    <div className={styles.description}>This is a dApp which allow anyone to buy and sell his land.</div>
                    <div className={styles.description}>
                        Total Number of Lands : {landNumber}
                        <br/>
                        You have Mint : {landBalance} NFTs
                    </div>
                    <div className={styles.flex}>
                        <button className={styles.button} onClick={()=>setSelectTab("SellLand")}>
                            Sell Land
                        </button>
                        <button className={styles.button} onClick={()=>setSelectTab("BuyLand")}>
                            Buy Land
                        </button>
                    </div>
                    {renderTabs()}
                    <div className={styles.container}>
                        <label>The superficie of your land</label>
                        <input
                            placeholder="0"
                            type="number"
                            onChange={(e)=>setSuperficie(e.target.value)}
                        />
                        <button className={styles.button} onClick={()=>mintLandNFT(superficie)}>
                            Mint your Land
                        </button>
                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                Made with &#10084; by GAHOU Isaac from Benin Republic.
            </footer>
        </div>
    );

}