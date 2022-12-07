App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
  
    $.getJSON('../itens.json', function(data) {
      var itensRow = $('#itensRow');
      var itensTemplate = $('#itensTemplate');

      for (i = 0; i < data.length; i ++) {
        itensTemplate.find('.panel-title').text(data[i].name);
        itensTemplate.find('img').attr('src', data[i].picture);
        itensTemplate.find('.item-marca').text(data[i].marca);
        itensTemplate.find('.item-estoque').text(data[i].estoque);
        // itensTemplate.find('.item-disponibilidade').text(data[i].disponivel);
        itensTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        itensRow.append(itensTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
      // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    // $.getJSON('Adoption.json', function(data) {
    //   // Get the necessary contract artifact file and instantiate it with @truffle/contract
    //   var AdoptionArtifact = data;
    //   App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
    //   // Set the provider for our contract
    //   App.contracts.Adoption.setProvider(App.web3Provider);
    
    //   // Use our contract to retrieve and mark the adopted pets
    //   return App.markAdopted();
    // });
    
    $.getJSON('Buying.json', function(data) {
      
      var BuyingArtifact = data;
      App.contracts.Buying= TruffleContract(BuyingArtifact);
    
     
      App.contracts.Buying.setProvider(App.web3Provider);
    
      
      return App.markSold();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleSell);
  },

  markSold: function() {

    // var adoptionInstance;

    // App.contracts.Adoption.deployed().then(function(instance) {
    //   adoptionInstance = instance;

    //   return adoptionInstance.getAdopters.call();
    // }).then(function(adopters) {
    //   for (i = 0; i < adopters.length; i++) {
    //     if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //       $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    //     }
    //   }
    // }).catch(function(err) {
    //   console.log(err.message);
    // });

    var buyingInstance;

  App.contracts.Buying.deployed().then(function(instance) {
    buyingInstance = instance;

        return buyingnstance.getBuyers.call();
      }).then(function(buyers) {
        for (i = 0; i < buyers.length; i++) {
          if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-pet').eq(i).find('button').text('Sold').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
      
    },

  handleSell: function(event) {


      //     var adoptionInstance;

      // web3.eth.getAccounts(function(error, accounts) {
      //   if (error) {
      //     console.log(error);
      //   }

      //   var account = accounts[0];

      //   App.contracts.Adoption.deployed().then(function(instance) {
      //     adoptionInstance = instance;

      //     // Execute adopt as a transaction by sending account
      //     return adoptionInstance.adopt(petId, {from: account});
      //   }).then(function(result) {
      //     return App.markAdopted();
      //   }).catch(function(err) {
      //     console.log(err.message);
      //   });
      // });

    event.preventDefault();

    var itemId = parseInt($(event.target).data('id'));

    var buyingInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Buying.deployed().then(function(instance) {
        buyingInstance = instance;

        return buyingInstance.buy(itemId, {from: account});
      }).then(function(result) {
        return App.markSold();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
