package com.example.gmall.dto.delivery;

import lombok.Getter;

@Getter
public class DeliveryAddressRequestDTO {

    private String recipientName;
    
    private String recipientPhone;
    
    private String zipcode;
    
    private String address;
    
    private String addressDetail;
    
    private boolean isDefault;
    
    private String memo;
}
