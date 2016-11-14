************
Introduction
************

Ce simple module nodeJS permet de collecter un certain nombre de données et de métriques sur le modem-route Livebox 4 d'Orange.
Je l'utilise personnellement pour récupérer les données de ma Livebox, les injecter dans une base InfluxDB et construire des `tableaux de bord<livebox_grafana.json>`_ avec Grafana.

********
Méthodes
********

Quatre méthodes asynchrones sont actuellement disponibles. Des exemples d'informations recueillies sont disponibles plus bas.

* ``connect( callback( err ) )`` pour effectuer la connexion à la Livebox
* ``deviceInfo( callback( err, data ) )`` pour obtenir des informations générales sur la Livebox
* ``getDSLStats( callback( err, data ) )`` pour obtenir des métriques sur la qualité du lien ADSL
* ``getMibs( mib, callback( err, data ) )`` pour interroger certaines mib interne de la Livebox. Je n'interroge pour ma part que la mib 'dsl'.

*****
Usage
*****

Voici un exemple de structure de code pour l'utilisation de ce module.

.. code:: javascript

  var Livebox = require( 'livebox-collect' );
  var livebox = new Livebox( '192.168.1.1', 'admin', 'motdepasse' );

  livebox.connect( function( err ) {

    // Vérifier les erreurs
    if( err ) {
      process.exit( 1 );
    }

    livebox.deviceInfo( function( err, data ) {

      // Vérifier les erreurs
      if( err ) {
        process.exit( 1 );
      }

      // Play with data
      console.log( data );
    }
  }

******************************
Exemple de données recueillies
******************************
Voici un exemple des données que l'on peut recueillir à l'aide de chacune des méthodes décrites plus haut. Les informations sensibles ont volontairement été masquées.

deviceInfo
==========

.. code::

    { status: 
      { Manufacturer: 'Sagemcom',
        ManufacturerOUI: '904D4A',
        ModelName: 'SagemcomFast5360_MIB4',
        Description: 'SagemcomFast5360_MIB4 Sagemcom fr',
        ProductClass: 'Livebox 4',
        SerialNumber: '****',
        HardwareVersion: 'SG_LB4_1.1.0',
        SoftwareVersion: 'SG40_sip-fr-2.15.14.1_7.21.3.1',
        RescueVersion: 'SG40_sip-fr-2.14.8.1',
        ModemFirmwareVersion: '',
        EnabledOptions: '',
        AdditionalHardwareVersion: '',
        AdditionalSoftwareVersion: 'g0-f-sip-fr',
        SpecVersion: '1.1',
        ProvisioningCode: '******',
        UpTime: 286928,
        FirstUseDate: '0001-01-01T00:00:00Z',
        DeviceLog: '',
        VendorConfigFileNumberOfEntries: 1,
        ManufacturerURL: 'http://www.sagemcom.com/',
        Country: 'fr',
        ExternalIPAddress: '***********',
        DeviceStatus: 'Up',
        NumberOfReboots: 10,
        UpgradeOccurred: false,
        ResetOccurred: false,
        RestoreOccurred: false
      }
    }

getDSLStats
===========

.. code::

    { status: 
      { ReceiveBlocks: 610430,
        TransmitBlocks: 444088,
        CellDelin: 0,
        LinkRetrain: 1,
        InitErrors: 0,
        InitTimeouts: 0,
        LossOfFraming: 0,
        ErroredSecs: 170,
        SeverelyErroredSecs: 15,
        FECErrors: 4910041,
        ATUCFECErrors: 75314,
        HECErrors: 0,
        ATUCHECErrors: 0,
        CRCErrors: 1174,
        ATUCCRCErrors: 38
      }
    }


getMibs( 'dsl' )
================

.. code::

    { dsl0:
      { LastChangeTime: 232559,
        LastChange: 55132,
        UpstreamCurrRate: 9191,
        DownstreamCurrRate: 65262,
        LinkStatus: 'Up',
        UpstreamMaxRate: 12776,
        DownstreamMaxRate: 66156,
        UpstreamAttenuation: 386,
        DownstreamAttenuation: 371,
        DownstreamLineAttenuation: 374,
        UpstreamLineAttenuation: 396,
        UpstreamNoiseMargin: 94,
        DownstreamNoiseMargin: 81,
        UpstreamPower: 20,
        DownstreamPower: 145,
        FirmwareVersion: '****',
        StandardsSupported: 'G.992.1_Annex_A, G.992.1_Annex_B, G.992.1_Annex_C,T1.413, T1.413i2,ETSI_101_388, G.992.2,G.992.3_Annex_A, G.992.3_Annex_B, G.992.3_Annex_C, G.992.3_Annex_I, G.992.3_Annex_J,G.992.3_Annex_M, G.992.4,G.992.5_Annex_A, G.992.5_Annex_B, G.992.5_Annex_C, G.992.5_Annex_I, G.992.5_Annex_J, G.992.5_Annex_M, G.993.1,G.993.1_Annex_A, G.993.2_Annex_A, G.993.2_Annex_B',
        StandardUsed: 'G.993.2_Annex_B',
        DataPath: 'Interleaved',
        InterleaveDepth: 0,
        ModulationType: 'VDSL',
        ChannelEncapsulationType: 'G.993.2_Annex_K_PTM',
        ModulationHint: 'VDSL',
        CurrentProfile: '17a',
        UPBOKLE: 140
      }
    }
