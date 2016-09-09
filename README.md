# refdocs-portal
A web application built on keystone-js for handling e.g. datasets for DOI publication to DataCite.

Currently utilizing metadata schema 3.0

See [http://schema.datacite.org/](http://schema.datacite.org/) for more information

## Pre requisites
The application is currently only able to store files on a azure cloud instance. 
However it would not require much work in order to make it work with other storage
adapters. 

In order for the application to run correctly there needs to be a `.env` file containing the following variables:
* `AZURE_STORAGE_ACCOUNT` 
* `AZURE_STORAGE_ACCESS_KEY`
* `AZURE_STORAGE_CONTAINER`
* `DATA_CITE_PREFIX` 
* `DATA_CITE_USER` Username for the DataCite api
* `DATA_CITE_PASSWORD` Password for the DataCite api
* `DATA_CITE_TEST_MODE` Determines if the upload api should add testMode=1 query string to all calls
