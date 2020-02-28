# BloomIQ Aggregator

## Summary

Reference implementation for BloomIQ aggregator (model for credit reporting-like services on the Bloom Protocol).  The purpose of the BloomIQ aggregator functionality is to allow an intermediate data aggregator to issue verifiable credentials as to the completeness of VCs issued for a particular subject within a particular span of time, optionally categorized with string-based tags.

All API endpoints are signature-based and designed to isolate the exact criteria of the request to prevent replay attacks.

## Associations 

Associations pertain to subject consent for the aggregator to store aggregation data on their behalf.

### Allow Association

The subject declares their consent for the aggregator to store aggregation data, pertaining to specific criteria such as a range of dates and specific VC tags.

### List Association

The subject requests a list of all associations registered to their DID.

### Show Association

The subject requests a specific association.

### Revoke Association

The subject revokes a specific association.

## Reporters

Reporters are permitted by a subject to report on them.  The intention is to require the subject to consent to a reporter to issue VCs regarding them, generally as a precondition to entering into a relationship with them (outside of the scope of the aggregator).  The final VC issued by a reporter should be an end-of-relationship consent, otherwise if the subject issues a revocation prematurely it may be a negative signal indicating they were trying to prevent negative data from being reported about them.

### Allow Reporter

The subject permits a reporter to report data about them.

### List Reporter

The subject requests a lists reporters permitted to report about them.

### Show Reporter

The subject queries to see if a specific reporter can report about them.

### Revoke Reporter

The subject revokes permission for a reporter to report about them.

## Reports

The report API pertains to specific reports (VCs) filed about a given subject.

### Submit Report

The reporter issues a report about a subject.

### Revoke Report

The reporter revokes a report about a subject.

### List Report As Reporter

The reporter requests reports provided by themself.

### Show Report As Reporter

The reporter requests a specific report provided by themself.

### List Report As Subject

The subject requests reports provided about themself.

### Show Report As Subject

The subject requests a specific report provided about themself.


## VC API

The VC API is used by the subject to request VCs from aggregator regarding the completeness of a given query.  This may be used to show the completeness of a set of VCs issued about the subject within a given time and/or pertaining to specific tags.

### Issue VC

The subject requests a VC issued about them, with optional date constraints and tag queries.  The VC may be used to demonstrate the completeness of VCs issued about the subject, with regard to specific sets of tags, within any open or closed interval of time.

### List VC

The subject may list all VCs previously issued by the aggregator about them.

### Show VC

The subject may request a specific VC issued about them.

### Delete VC

The subject may delete a specific VC issued about them.
