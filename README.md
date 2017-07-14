# Build-your-own-backend (BYOB)

The focus of this project was to find data on the internet and build a backend using the data.  I chose to find child malnutrition data for children around the world.  This data was important to me because I would like to be able to help with child hunger reliefs.

Unicef provided a wealth of information which can be found [here](https://data.unicef.org/topic/nutrition/malnutrition/).

The data was taken directly from source and formated from a csv to json and then further formated so that it could be used to populate a database.  The following endpoints were implented:

## GET endpoints:

### /api/v1/countries

This will retrieve the name, iso code, region and income group of every country that is involved in the study.

### /api/v1/malnutrition_data

This will retrieve every data point recorded in the study.  The data obtained contains the following information:

country_name: Indicates the country of the study.
year: Indicates the year in which the study took place.
under_5_population:  Indicates the number of children in the country that are under 5 years of age.
sample_size:  Indicates the number of children that were used in the study.
severe_wasting:  Indicates the percentage of the sample that are below minus three deviations of the median weight.
wasting:  Indicates the percentage of the sample that are below minus two deviations of the median weight.
overweight:  Indicates the percentage of the sample that above two standard deviations of the median weight.
stunting:  Indicates the percentage of the sample that are below two standard deviations of median height.
underweight:  Indicates the percentage of the sample that are below minus two standard deviations of the median weight.

### /api/v1/countries/malnutrition_data/:name

This will retrieve all malnutrition data for a given country.  For example if the user would like the malnutrition data for Albania, they would use

/api/v1/countries/malnutrition_data/Albania

### /api/v1/yearly/malnutrition_data/:year

This will retrieve all malnutrition data for a given year  For example if the user would like the malnutrition data for 2009, they would use

/api/v1/countries/malnutrition_data/2009

## POST endpoints:

### /api/v1/countries

This allows the user to post a new country into the database given the user has proper authorization.  All the country information is required in order to make this post.

### /api/v1/malnutrition_data

This allows the user to post new malnutrition_data into the database given the user has proper authorization.  Only the country_name and year is absolutely required in order to make this post.

## PATCH endpoints:

### /api/v1/countries/:name

If the user has proper authorization , this allows the user to update a given country entry within the database.  The user can choose any or all of the information about the country to update.

### /malnutrition_data/:country_name/:year

If the user has proper authorization, this allows the user to update a given malnutrition entry given the country_name and year of the data point.  The user can choose any or all of the information about the malnutrition data to update.

## DELETE endpoints:

### /countries/:name

If the user has proper authorization, this allow the user to delete a country record from the database.

### /malnutrition_data/:country_name/:year

If the user has proper authorization, this allow the user to delete a malnutrition record from the database.
