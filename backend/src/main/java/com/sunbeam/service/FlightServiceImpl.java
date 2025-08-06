package com.sunbeam.service;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.sunbeam.dao.AddAirlineDao;
import com.sunbeam.dao.UserDao;
import com.sunbeam.dto.AirlineDTO;
import com.sunbeam.entities.AirlineDetail;
import com.sunbeam.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class FlightServiceImpl implements FlightService {

	public ModelMapper modelMapper;

	public AddAirlineDao addAirlineDao;
	
	public UserDao userDao;
	
	@Override
	public AirlineDTO addAirline(AirlineDTO airlineDTO) {

		AirlineDetail airlineDetail = modelMapper.map(airlineDTO, AirlineDetail.class);
		airlineDetail.setDate(LocalDate.now());
		User admin = userDao.findById(airlineDTO.getAdmin_id())
				.orElseThrow(() -> new RuntimeException("Admin not found"));
		airlineDetail.setAdmin(admin);
		
		AirlineDetail saved = addAirlineDao.save(airlineDetail);

	    AirlineDTO responseDTO = modelMapper.map(saved, AirlineDTO.class);
	    responseDTO.setAdmin_id(admin.getUserId());

		return responseDTO;

	}

	public Boolean airlineDelete(Long id) {
	    if (addAirlineDao.existsById(id)) {
	        addAirlineDao.deleteById(id);
	        return true;
	    } else {
	        return false;
	    }
	}

}
