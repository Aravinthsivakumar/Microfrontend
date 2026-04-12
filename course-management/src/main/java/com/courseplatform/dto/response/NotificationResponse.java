// response/NotificationResponse.java
package com.courseplatform.dto.response;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class NotificationResponse {
    private Long id;
    private String type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private String senderName;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public boolean isRead() {
		return read;
	}
	public void setRead(boolean read) {
		this.read = read;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public String getSenderName() {
		return senderName;
	}
	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	
	public NotificationResponse() {
		super();
		// TODO Auto-generated constructor stub
	}
	public NotificationResponse(Long id, String type, String message, boolean read, LocalDateTime createdAt,
			String senderName) {
		super();
		this.id = id;
		this.type = type;
		this.message = message;
		this.read = read;
		this.createdAt = createdAt;
		this.senderName = senderName;
	}
    
	
    
}