import pandas as pd
import numpy as np
from numpy.linalg import lstsq
import matplotlib.pyplot as plt
import sys
import math


def fit_data():


    args = sys.argv[1:]
    data = pd.read_csv('output.csv')
    gear_ratio = int(args[2])
    encoder_1_resolution = int(args[0])
    encoder_2_resolution = int(args[1])
    rated_motor_torque_mNm = int(args[3])

    # Open the binary file in read-binary mode
    with open('encoder_calibration_table.bin', 'rb') as file:
        # Read the binary data into a NumPy array
        encoder_difference_lookup_table = np.fromfile(file, dtype=np.dtype('>i2'))  # Change dtype as needed

    position_array = np.linspace(0, encoder_1_resolution, encoder_difference_lookup_table.shape[0])

    if encoder_2_resolution != 0:
        encoder_ratio = encoder_1_resolution / encoder_2_resolution
    else:
        encoder_ratio = 1


    # Read the CSV file
    df = pd.read_csv('data_recording_for_torque_estimation.csv')

    # Extract input columns (1 -> 4 columns)
    encoder_1_ticks = df.iloc[:, 1].values
    encoder_2_ticks = df.iloc[:, 2].values
    if encoder_1_resolution != 0:
        single_turn_value_encoder_1_ticks = encoder_1_ticks % encoder_1_resolution
    else:
        single_turn_value_encoder_1_ticks = encoder_1_ticks % 1

    torsion = encoder_1_ticks - (encoder_2_ticks * encoder_ratio / gear_ratio)
    torsion = torsion - np.interp(single_turn_value_encoder_1_ticks, position_array,\
                                 encoder_difference_lookup_table)
    torsion = torsion - np.mean(torsion)



    motor_speed = df.iloc[:, 3].values / gear_ratio
    torque_actual_value_mNm = (df.iloc[:, 4].values * rated_motor_torque_mNm / 1000)

    # Sign of Speed
    sign_of_speed = motor_speed
    sign_of_speed = np.where((sign_of_speed.all() >= -1000 & sign_of_speed.all() <= 1000), sign_of_speed, sign_of_speed/1000)
    sign_of_speed[sign_of_speed > 1000] = 1
    sign_of_speed[sign_of_speed < -1000] = -1


    offset = np.ones((torsion.shape[0], ))
    # Add a column of ones to X to account for the intercept term
    X = np.transpose(np.vstack([torsion, offset, motor_speed, sign_of_speed, torque_actual_value_mNm]))


    # Extract the target column (5th column)
    y = df.iloc[:, 5].values

    # Perform least squares fitting
    coefficients, residuals, rank, s = lstsq(X, y, rcond=None)

    # Write the coefficients to a CSV file
    coefficients_df = pd.DataFrame(coefficients, columns=['Coefficients'])
    coefficients_df.to_csv('coefficients.csv', index=False)

    return

if __name__ == "__main__":

    fit_data()
