import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import AuctionHouse from '../build/contracts/AuctionHouse.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // Load account
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = AuctionHouse.networks[networkId]
    if(networkData){
      const auctionHouse = new web3.eth.Contract(AuctionHouse.abi, networkData.address)
      this.setState({ auctionHouse })
      const productCount = await auctionHouse.methods.productCount().call()
      this.setState({ loading: false})
    }
    else
    {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props){
    super(props)
    this.state ={
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
    this.createProduct = this.createProduct.bind(this)
  }

  createProduct(name, price, artist){
    this.setState({ loading: true })
    this.state.auctionHouse.methods.createProduct(name, price, artist).send({ from: this.state.account }).once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading 
                ? <div id = "loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : <Main createProduct={this.createProduct}/>
              }
              
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
