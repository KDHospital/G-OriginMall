package com.example.gmall.dto;

import com.example.gmall.domain.Member;

import lombok.Getter;

@Getter
public class ProductCreateRequestDTO {
	private Integer categoryId;
	private Long sellerId;
	private String pname;
	private String pdesc;
	private Integer listprice;
	private Integer discountPrice;
	private Integer price;
	private Integer stock;
	private Integer deliveryFee;
	private boolean isCertified;
}
