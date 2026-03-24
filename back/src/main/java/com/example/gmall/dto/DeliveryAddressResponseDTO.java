package com.example.gmall.dto;

import com.example.gmall.domain.DeliveryAddress;
import lombok.Getter;

@Getter
public class DeliveryAddressResponseDTO {

    private Long addressId;
    
    private String recipientName;
    
    private String recipientPhone;
    
    private String zipcode;
    
    private String address;
    
    private String addressDetail;
    
    private boolean isDefault;
    
    private String memo;

    public DeliveryAddressResponseDTO(DeliveryAddress deliveryAddress) {
        this.addressId = deliveryAddress.getAddressId();
        this.recipientName = deliveryAddress.getRecipientName();
        this.recipientPhone = deliveryAddress.getRecipientPhone();
        this.zipcode = deliveryAddress.getZipcode();
        this.address = deliveryAddress.getAddress();
        this.addressDetail = deliveryAddress.getAddressDetail();
        this.isDefault = deliveryAddress.isDefault();
        this.memo = deliveryAddress.getMemo();
    }
}