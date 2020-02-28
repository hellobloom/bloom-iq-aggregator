# BloomIQ Aggregator

## Summary

Reference implementation for BloomIQ aggregator (model for credit reporting-like services on the Bloom Protocol).  The purpose of the BloomIQ aggregator functionality is to allow an intermediate data aggregator to issue verifiable credentials as to the completeness of VCs issued for a particular subject within a particular span of time, optionally categorized with string-based tags.

All API endpoints are signature-based and designed to isolate the exact criteria of the request to prevent replay attacks.

## Subject registration

Subject registration may be performed via open registration with the API, or entered into the database outside of the scope of the aggregator API.  
