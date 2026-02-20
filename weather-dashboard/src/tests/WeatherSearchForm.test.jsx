import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WeatherSearchForm from '../components/WeatherSearchForm';

describe('WeatherSearchForm', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders form correctly', () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={false} />);
    
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/celsius/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fahrenheit/i)).toBeInTheDocument();
  });

  test('shows validation error when city is empty', async () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={false} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/city name is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('shows validation error for short city name', async () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={false} />);
    
    const cityInput = screen.getByPlaceholderText(/enter city name/i);
    await userEvent.type(cityInput, 'a');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('shows validation error for invalid characters', async () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={false} />);
    
    const cityInput = screen.getByPlaceholderText(/enter city name/i);
    await userEvent.type(cityInput, 'New York 123');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/only contain letters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('submits form with valid city name and default unit', async () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={false} />);
    
    const cityInput = screen.getByPlaceholderText(/enter city name/i);
    await userEvent.type(cityInput, 'London');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('London', 'metric');
    });
  });

  test('submits form with fahrenheit unit selected', async () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={false} />);
    
    const cityInput = screen.getByPlaceholderText(/enter city name/i);
    await userEvent.type(cityInput, 'Paris');
    
    const fahrenheitRadio = screen.getByLabelText(/fahrenheit/i);
    fireEvent.click(fahrenheitRadio);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Paris', 'imperial');
    });
  });

  test('disables inputs when loading', () => {
    render(<WeatherSearchForm onSearch={mockOnSearch} isLoading={true} />);
    
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
    expect(screen.getByLabelText(/celsius/i)).toBeDisabled();
    expect(screen.getByLabelText(/fahrenheit/i)).toBeDisabled();
  });
});