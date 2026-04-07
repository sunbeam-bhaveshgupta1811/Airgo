package com.sunbeam.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunbeam.dao.AddAirlineDao;
import com.sunbeam.dao.AddFlightDao;
import com.sunbeam.dao.AdminDao;
import com.sunbeam.dao.BookingDao;
import com.sunbeam.dao.FeedbackDao;
import com.sunbeam.dao.UserDao;
import com.sunbeam.dto.FeedbackDto;
import com.sunbeam.entities.AirlineDetail;
import com.sunbeam.entities.Feedback;
import com.sunbeam.response.AirlineResponseDto;
import com.sunbeam.response.ApiResponse;

@Service
public class AdminServiceImpl implements AdminService{

	@Autowired
	public AdminDao adminDao;
	
	@Autowired
	public AddFlightDao addFlightDao;
	
	@Autowired
	public BookingDao bookingDao;
	
	@Autowired
	public AddAirlineDao airlineDetailsDao;
	
	@Autowired
	private FeedbackDao feedbackDao;
	
	@Autowired
	private UserDao userdao;
	
	
	@Autowired
	private ModelMapper modelMapper;
	
	
	@Override
	public long getTotalAirlinesCount() {
		return airlineDetailsDao.count();
	}

	@Override
	public long getTotalFlightsCount() {
		return addFlightDao.count();
	}


	@Override
	public Double getTotalAmountBooking() {
		return bookingDao.getTotalAmountBookingPassenger();
	}

	@Override
	public List<AirlineResponseDto> getAllAirlines() {
		List<AirlineDetail> airlineDetail = airlineDetailsDao.findAll();
		List<AirlineResponseDto> airlineResponseDtos = new ArrayList<>();
		
		for(AirlineDetail f : airlineDetail) {
			AirlineResponseDto dto = modelMapper.map(f,AirlineResponseDto.class);
			airlineResponseDtos.add(dto);
		}
		return airlineResponseDtos;
	}
	
	@Override
	public ApiResponse<List<FeedbackDto>> getAllFeedback() {
		
		List<Feedback> list = feedbackDao.findAll();
		List<FeedbackDto> feedbackDtos = new ArrayList<>();
		
		for(Feedback f : list) {
			FeedbackDto dto = modelMapper.map(f,FeedbackDto.class);
			dto.setBookingId(f.getBooking().getBookingId());
			dto.setFlightName(f.getBooking().getAirline());
			dto.setUserId(f.getUser().getId());
			feedbackDtos.add(dto);
		}
		
		
		return new ApiResponse<>(true, "Fetched all feedback successfully", feedbackDtos);
	}

	@Override
	public long getTotalBooking() {
		return bookingDao.count();
	}


//	@Override
//	public User getProfileData(String email) {
//		// TODO Auto-generated method stub
//		return null;
//	}

	

	
	
}
